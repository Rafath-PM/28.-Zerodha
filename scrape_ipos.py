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
        
    # 3. Save JSON database
    output_path = "/Users/rafath/Antigravity Projects/28. Zerodha/ipo-tracker-app/ipo_data.json"
    with open(output_path, "w") as out_file:
        json.dump(cleaned_stocks, out_file, indent=2)
        
    end_time = time.time()
    print(f"Scraper finished in {end_time - start_time:.2f} seconds.")
    print(f"Database saved to {output_path}")

if __name__ == "__main__":
    main()
