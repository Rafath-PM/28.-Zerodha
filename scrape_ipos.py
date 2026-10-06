import requests
from bs4 import BeautifulSoup
import re
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def get_year_data(year):
    url = f"https://www.chittorgarh.com/ipo/ipo_perf_tracker.asp?year={year}"
    print(f"Fetching performance tracker list for year {year}...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"Error fetching year {year}: status code {response.status_code}")
            return []
            
        html = response.text
        # Reconstruct Next.js payload
        pushes = re.findall(r'self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)', html)
        combined = "".join(pushes).replace('\\"', '"').replace('\\n', '\n')
        
        # Locate performancesDetails array
        idx = combined.find('"performancesDetails":')
        if idx == -1:
            print(f"performancesDetails not found for year {year}")
            return []
            
        start_idx = combined.find('[', idx)
        if start_idx == -1:
            return []
            
        brace_count = 0
        end_idx = start_idx
        for i in range(start_idx, len(combined)):
            char = combined[i]
            if char == '[':
                brace_count += 1
            elif char == ']':
                brace_count -= 1
                if brace_count == 0:
                    end_idx = i + 1
                    break
                    
        json_str = combined[start_idx:end_idx]
        try:
            raw_list = json.loads(json_str)
            print(f"Parsed {len(raw_list)} listings for year {year}")
            return raw_list
        except Exception as ex:
            # If standard JSON fails due to trailing commas or escape anomalies, try a looser evaluation
            print(f"Loose evaluation needed for year {year}: {ex}")
            # Try to fix backslashes or invalid escapes
            # Simple fallback regex parser to extract items
            items = []
            matches = re.finditer(r'\{[^{}]*"ipo_id":\d+.*?\}', json_str)
            for m in matches:
                try:
                    cleaned_item = m.group(0).replace('\\/', '/')
                    items.append(json.loads(cleaned_item))
                except:
                    pass
            print(f"Parsed {len(items)} listings loosely for year {year}")
            return items
            
    except Exception as e:
        print(f"Error scraping year {year}: {e}")
        return []

def scrape_description(stock):
    url = stock.get('detail_url')
    desc = "No description available."
    rec = "No recommendation data available on Chittorgarh."
    author_rec = "Not Rated"
    if not url:
        return desc, rec, author_rec
        
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            # 1. Try finding container with id 'ipoSummary'
            ipo_summary = soup.find('div', id='ipoSummary')
            if ipo_summary:
                paragraphs = [p.get_text().strip() for p in ipo_summary.find_all('p') if p.get_text().strip()]
                if paragraphs:
                    desc = " ".join(paragraphs)
            
            # Fallback if ipoSummary not found
            if desc == "No description available.":
                h2s = soup.find_all('h2')
                for h in h2s:
                    text = h.get_text().strip()
                    if "about" in text.lower() and "chittorgarh" not in text.lower():
                        parent = h.find_parent('div')
                        if parent:
                            ps = parent.find_all('p')
                            if ps:
                                desc = " ".join([p.get_text().strip() for p in ps if p.get_text().strip()])
                                break
                        sibling = h.find_next_sibling()
                        while sibling:
                            sib_text = sibling.get_text().strip()
                            if sib_text and len(sib_text) > 40 and not sib_text.startswith("+"):
                                desc = re.sub(r'\s+', ' ', sib_text).strip()
                                break
                            sibling = sibling.find_next_sibling()
                    if desc != "No description available.":
                        break
            
            # Extract author review_conclusion if present
            match = re.search(r'review_conclusion[^\,]*', response.text)
            if match:
                raw_str = match.group(0)
                clean_author = BeautifulSoup(raw_str.encode('utf-8').decode('unicode_escape'), 'html.parser').get_text().strip()
                clean_author = re.sub(r'review_conclusion.*?:', '', clean_author).replace('"', '').strip()
                if clean_author:
                    author_rec = clean_author

            # Extract recommendation table
            for t in soup.find_all("table"):
                if "subscribe" in t.text.lower() and "avoid" in t.text.lower():
                    rows = t.find_all("tr")
                    for r in rows:
                        cols = r.find_all("td")
                        if cols and "broker" in cols[0].text.lower():
                            try:
                                sub = cols[1].text.strip()
                                may = cols[2].text.strip()
                                neu = cols[3].text.strip()
                                avo = cols[4].text.strip()
                                rec = f"Broker Recommendation: {sub} Subscribe, {may} May Apply, {neu} Neutral, {avo} Avoid"
                            except:
                                pass
    except Exception as e:
        pass
    return desc, rec, author_rec

def main():
    start_time = time.time()
    all_raw = []
    
    # 1. Fetch listings for all 4 years
    for y in [2023, 2024, 2025, 2026]:
        all_raw.extend(get_year_data(y))
        
    print(f"Total raw listings fetched: {len(all_raw)}")
    
    # Filter to Mainboard listings and clean fields
    cleaned_stocks = []
    for item in all_raw:
        # Check if Mainboard / Mainline
        category = item.get("ipo_issue_category", "Mainline")
        if category and "sme" in category.lower():
            # Skip SME listings as per Mainboard focus or keep if wanted. Let's keep Mainline.
            continue
            
        name = item.get("ipo_company_name")
        if not name:
            continue
            
        listing_date = item.get("il_ipo_listing_date", "")
        if listing_date:
            listing_date = listing_date.split("T")[0] # Get YYYY-MM-DD
            
        issue_price = item.get("ipo_issue_price_normalised") or item.get("ipo_issue_price_final", 0)
        listing_price = item.get("ildt_open_price") or item.get("ildt_close_price", 0)
        listing_gain = item.get("change_in_percentage_listing_day", 0.0)
        
        # Get current close price (nse_close or bse_close)
        current_price = item.get("nse_close") or item.get("bse_close") or item.get("ildt_close_price") or issue_price
        current_return = item.get("ipo_profit_loss", 0.0)
        
        symbol = item.get("il_nse_script_symbol") or item.get("il_bse_script_id") or "SYMBOL"
        
        # Formulate detail URL
        url_folder = item.get("ipo_urlrewrite_folder_name")
        ipo_id = item.get("ipo_id")
        detail_url = ""
        if url_folder and ipo_id:
            detail_url = f"https://www.chittorgarh.com/ipo/{url_folder}/{ipo_id}/"
            
        # Determine status: "unlisted" if listing price/close price is missing or date is in future, else "listed"
        status = "listed"
        if not listing_price or not current_price or listing_price == 0:
            status = "unlisted"
            
        # Skip unlisted stocks from the historical performance tracker index to avoid duplicate unlisted items
        if status == "unlisted":
            continue

        cleaned_stocks.append({
            "id": f"stock-{ipo_id}" if ipo_id else name.lower().replace(" ", "-"),
            "name": name,
            "symbol": symbol,
            "listingDate": listing_date,
            "issuePrice": float(issue_price) if issue_price else 0.0,
            "listingPrice": float(listing_price) if listing_price else 0.0,
            "listingGain": float(listing_gain) if listing_gain else 0.0,
            "currentPrice": float(current_price) if current_price else 0.0,
            "currentReturn": float(current_return) if current_return else 0.0,
            "status": status,
            "sector": item.get("nse_series", "EQ") or "Equity",
            "detail_url": detail_url,
            "description": ""
        })
        
    print(f"Filtered to {len(cleaned_stocks)} Mainboard IPO stocks.")
    
    # 2. Scrape descriptions concurrently
    print("Scraping company descriptions concurrently...")
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_stock = {executor.submit(scrape_description, stock): stock for stock in cleaned_stocks}
        
        completed_count = 0
        for future in as_completed(future_to_stock):
            stock = future_to_stock[future]
            desc, rec, author_rec = future.result()
            stock["description"] = desc
            stock["recommendation"] = rec
            stock["authorRecommendation"] = author_rec
            completed_count += 1
            if completed_count % 10 == 0:
                print(f"Progress: {completed_count}/{len(cleaned_stocks)} descriptions scraped...")
                
    # Remove detail_url before saving
    for stock in cleaned_stocks:
        stock.pop("detail_url", None)
        
    # Scrape upcoming DRHP filings
    print("Scraping upcoming DRHP filings...")
    drhp_stocks = fetch_drhp_stocks()
    cleaned_stocks.extend(drhp_stocks)
    print(f"Added {len(drhp_stocks)} upcoming DRHP stocks.")

    # Scrape active unlisted IPOs (e.g. VNL, Nityas Gems, etc.)
    print("Scraping active unlisted IPOs awaiting listing...")
    unlisted_ipos = fetch_unlisted_ipos()
    
    # Helper to extract base tokens for deduplication against already listed stocks
    def get_base_tokens(name):
        cleaned = re.sub(r'\b(ltd|limited|ipo|inc|corp|corporation|india|private|pvt)\b', '', name.lower())
        tokens = [t for t in re.findall(r'[a-z0-9]+', cleaned) if len(t) > 2]
        return set(tokens)

    listed_tokens_list = [(s['name'], get_base_tokens(s['name'])) for s in cleaned_stocks if s.get('status') == 'listed']

    def is_already_listed(unlisted_name):
        u_toks = get_base_tokens(unlisted_name)
        if not u_toks:
            return False
        for lname, l_toks in listed_tokens_list:
            overlap = u_toks.intersection(l_toks)
            if len(u_toks) == 1 and len(overlap) == 1:
                if len(list(overlap)[0]) >= 4:
                    return True
            elif len(overlap) >= 2:
                return True
        return False

    def parse_end_date(date_str):
        if not date_str:
            return None
        months = {
            'january': 1, 'jan': 1, 'february': 2, 'feb': 2, 'march': 3, 'mar': 3,
            'april': 4, 'apr': 4, 'may': 5, 'june': 6, 'jun': 6, 'july': 7, 'jul': 7,
            'august': 8, 'aug': 8, 'september': 9, 'sep': 9, 'october': 10, 'oct': 10,
            'november': 11, 'nov': 11, 'december': 12, 'dec': 12
        }
        found_month = None
        for m_name, m_num in months.items():
            if m_name in date_str.lower():
                found_month = m_num
                break
        if not found_month:
            return None
        nums = re.findall(r'\d+', date_str)
        if len(nums) >= 2:
            end_day = int(nums[1])
            try:
                import datetime
                return datetime.date(2026, found_month, end_day)
            except:
                return None
        return None

    added_unlisted = 0
    seen_unlisted_names = set()
    for u_stock in unlisted_ipos:
        ed = parse_end_date(u_stock.get("expectedDate"))
        # Only include active recent IPOs whose bidding ended within the last 10 days (>= Sep 25 or October)
        is_active_window = False
        if ed:
            if (ed.month == 10) or (ed.month == 9 and ed.day >= 25):
                is_active_window = True
        elif not u_stock.get("expectedDate"):
            is_active_window = True
            
        base_name_clean = re.sub(r'\b(sme|ltd|limited|ipo)\b', '', u_stock["name"].lower()).strip()
        
        if is_active_window and not is_already_listed(u_stock["name"]) and base_name_clean not in seen_unlisted_names:
            seen_unlisted_names.add(base_name_clean)
            cleaned_stocks.append(u_stock)
            added_unlisted += 1
    print(f"Added {added_unlisted} genuine unlisted IPOs awaiting listing.")

    # 3. Save JSON database
    output_path = "/Users/rafath/Antigravity Projects/28. Zerodha/ipo-tracker-app/ipo_data.json"
    with open(output_path, "w") as out_file:
        json.dump(cleaned_stocks, out_file, indent=2)
        
    end_time = time.time()
    print(f"Scraper finished in {end_time - start_time:.2f} seconds.")
    print(f"Database saved to {output_path}")

def determine_ipo_status(date_str):
    import datetime
    today = datetime.date(2026, 10, 6)
    
    months = {
        'january': 1, 'jan': 1, 'february': 2, 'feb': 2, 'march': 3, 'mar': 3,
        'april': 4, 'apr': 4, 'may': 5, 'june': 6, 'jun': 6, 'july': 7, 'jul': 7,
        'august': 8, 'aug': 8, 'september': 9, 'sep': 9, 'october': 10, 'oct': 10,
        'november': 11, 'nov': 11, 'december': 12, 'dec': 12
    }
    
    found_month = None
    for m_name, m_num in months.items():
        if m_name in date_str.lower():
            found_month = m_num
            break
            
    if not found_month:
        return 'unlisted'
        
    nums = re.findall(r'\d+', date_str)
    if len(nums) >= 2:
        start_day = int(nums[0])
        end_day = int(nums[1])
        
        start_month = found_month
        end_month = found_month
        
        if start_day > end_day:
            start_month = found_month - 1 if found_month > 1 else 12
            
        try:
            start_date = datetime.date(2026, start_month, start_day)
            end_date = datetime.date(2026, end_month, end_day)
            
            if start_date <= today <= end_date:
                return 'open'
            elif today > end_date:
                return 'unlisted'
            else:
                return 'unlisted'
        except:
            pass
    return 'unlisted'

def fetch_unlisted_ipos():
    unlisted_stocks = []
    
    # 1. Scrape IPOWatch Mainboard & SME live subscription tables
    try:
        url = 'https://ipowatch.in/upcoming-ipo-list/'
        req = requests.get(url, headers=headers, timeout=15)
        if req.status_code == 200:
            soup = BeautifulSoup(req.text, 'html.parser')
            tables = soup.find_all('table')
            
            for t_idx in range(min(2, len(tables))):
                t = tables[t_idx]
                cat_name = "Mainboard IPO" if t_idx == 0 else "SME IPO"
                rows = t.find_all('tr')[1:]
                for idx, r in enumerate(rows):
                    cols = [td.get_text(strip=True) for td in r.find_all(['th', 'td'])]
                    if len(cols) >= 4:
                        name = cols[0]
                        date = cols[1]
                        size = cols[2]
                        price_band = cols[3]
                        platform = cols[4] if len(cols) > 4 and ('NSE' in cols[4] or 'BSE' in cols[4]) else cat_name
                        
                        prices = re.findall(r'\d+(?:\.\d+)?', price_band.replace(',', ''))
                        issue_price = float(prices[-1]) if prices else 0.0
                        
                        clean_symbol = re.sub(r'[^a-zA-Z0-9]', '', name).upper()[:10]
                        status_type = determine_ipo_status(date)
                        
                        unlisted_stocks.append({
                            'id': f'unlisted-ipowatch-t{t_idx}-{idx+1}',
                            'name': name if 'SME' not in platform else f"{name} (SME)",
                            'symbol': clean_symbol or 'UNLISTED',
                            'listingDate': '2026-10-06',
                            'expectedDate': date,
                            'issuePrice': issue_price,
                            'listingPrice': 0.0,
                            'listingGain': 0.0,
                            'currentPrice': 0.0,
                            'currentReturn': 0.0,
                            'status': status_type,
                            'sector': platform,
                            'description': f'{name} IPO ({platform}) is currently {"open for bidding" if status_type == "open" else "awaiting allotment / listing"} (Bidding Window: {date}). Expected Issue Size is {size} with Price Band of {price_band}.',
                            'recommendation': f'Price Band: {price_band} | Issue Size: {size}',
                            'authorRecommendation': f'{"IPO Open Now" if status_type == "open" else "Awaiting Listing"} ({date})',
                            'priceBand': price_band,
                            'issueSize': size
                        })
    except Exception as e:
        print('Error fetching IPOWatch unlisted IPOs:', e)

    # 2. Also merge direct Chittorgarh Dashboard badges
    try:
        url_dash = 'https://www.chittorgarh.com/ipo/ipo_dashboard.asp'
        req_dash = requests.get(url_dash, headers=headers, timeout=15)
        if req_dash.status_code == 200:
            soup_dash = BeautifulSoup(req_dash.text, 'html.parser')
            tables_dash = soup_dash.find_all('table')
            if len(tables_dash) > 0:
                t0 = tables_dash[0]
                for idx, r in enumerate(t0.find_all('tr')[1:]):
                    tds = r.find_all('td')
                    if tds:
                        name_td = tds[0]
                        a_tag = name_td.find('a')
                        if not a_tag:
                            continue
                        company_name = a_tag.get_text(strip=True)
                        
                        badge_spans = name_td.find_all('span', class_=re.compile('badge'))
                        badge_classes = ' '.join([' '.join(b.get('class', [])) for b in badge_spans])
                        badge_titles = ' '.join([b.get('title', '') for b in badge_spans if b.get('title')])
                        date_span = name_td.find('span', class_=re.compile('float-end'))
                        date_str = date_span.get_text(strip=True) if date_span else ''
                        
                        if badge_spans:
                            status_type = 'open' if 'bg-success' in badge_classes or 'open' in badge_titles.lower() else 'unlisted'
                            clean_symbol = re.sub(r'[^a-zA-Z0-9]', '', company_name).upper()[:10]
                            
                            unlisted_stocks.append({
                                'id': f'direct-dash-{idx+1}',
                                'name': company_name,
                                'symbol': clean_symbol or 'IPO',
                                'listingDate': '2026-10-06',
                                'expectedDate': date_str,
                                'issuePrice': 0.0,
                                'listingPrice': 0.0,
                                'listingGain': 0.0,
                                'currentPrice': 0.0,
                                'currentReturn': 0.0,
                                'status': status_type,
                                'sector': 'Mainboard IPO',
                                'description': f'{company_name} IPO is currently {"open for bidding" if status_type == "open" else "awaiting allotment / listing"} (Bidding Window: {date_str}).',
                                'recommendation': f'Bidding Window: {date_str}',
                                'authorRecommendation': badge_titles or ('Open Now' if status_type == 'open' else 'Awaiting Listing'),
                                'priceBand': 'See Detail',
                                'issueSize': 'Mainboard'
                            })
    except Exception as e:
        print('Error fetching Chittorgarh dashboard IPOs:', e)

    return unlisted_stocks

def fetch_drhp_stocks():
    drhp_stocks = []
    try:
        url = 'https://ipowatch.in/upcoming-ipo-list/'
        req = requests.get(url, headers=headers, timeout=15)
        if req.status_code == 200:
            soup = BeautifulSoup(req.text, 'html.parser')
            tables = soup.find_all('table')
            if len(tables) >= 3:
                rows = tables[2].find_all('tr')[1:]
                for idx, r in enumerate(rows):
                    cols = [td.get_text(strip=True) for td in r.find_all(['th', 'td'])]
                    if len(cols) >= 4:
                        name = cols[0]
                        date = cols[1]
                        price = cols[2]
                        size = cols[3]
                        drhp_status = cols[4] if len(cols) > 4 else 'DRHP'
                        
                        drhp_stocks.append({
                            'id': f'drhp-{idx+1}',
                            'name': name,
                            'symbol': 'DRHP',
                            'listingDate': f'Expected {date}' if date != 'TBA' else 'DRHP Filed',
                            'issuePrice': 0.0,
                            'listingPrice': 0.0,
                            'listingGain': 0.0,
                            'currentPrice': 0.0,
                            'currentReturn': 0.0,
                            'status': 'upcoming',
                            'sector': 'Mainboard DRHP',
                            'description': f'{name} has submitted its Draft Red Herring Prospectus (DRHP) to SEBI. Expected issue size is {size} with price band {price}.',
                            'recommendation': f'Price Band: {price} | Issue Size: {size}',
                            'authorRecommendation': 'DRHP Filed' if drhp_status in ['DRHP', '–'] else drhp_status,
                            'priceBand': price,
                            'issueSize': size
                        })
    except Exception as e:
        print('Error fetching DRHP stocks:', e)
    return drhp_stocks

if __name__ == "__main__":
    main()


