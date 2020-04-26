"""
This is a scraper.
It scrapes cactus data from the website:
http://swbiodiversity.org/seinet/imagelib/index.php?taxon=Cactaceae

Extracted attributes for each cactus:
- Species Name
- Date the sample was collected
- Latitude and Longitude of the place where it was collected from
- Description of the sample

@author Tariq M Nasim
email: tnasim@asu.edu
"""

import re
import random
import traceback
import datetime
import urllib.request
import urllib.parse
from urllib.error import HTTPError, URLError
from socket import timeout
from bs4 import BeautifulSoup
import pandas as pd

INDEX_FILE_PATH = ""

TAXON_URL_PREFIX = "http://swbiodiversity.org/seinet/taxa/index.php?taxon="

SEINET_WEB_URL = "http://swbiodiversity.org/seinet/imagelib/index.php?taxon=Cactaceae"

LOCAL_FILE_PATH = "static_pages/SEINet Portal Network Image Library.htm"
LOCAL_FILE_TAXON_CYLINDROPUNTIA_RAMOSISSIMA = "static_pages/SEINet Portal Network - Cylindropuntia ramosissima.htm"
LOCAL_FILE_TAXON_DETAILS_ASU_FORMAT = "static_pages/SEINet Portal Network Detailed Collection Record Information.htm"
LOCAL_FILE_TAXON_DETAILS_OTHER_FORMAT = "static_pages/SEINet Portal Network Image Details_ 446138.htm"
LOCAL_FILE_TAXON_DETAILS_OTHER_FORMAT2 = "static_pages/SEINet Portal Network Image Details_ 216387.htm"

DATA_LIMIT = 3240
MAX_TRY_PER_TAXON = 3
count = 0
MAX_LOCALITY_LEN = 150

CONNECTION_TIME_LIMIT = 5

def to_float(value):
    try:
        return float(value)
    except:
        return -200

def get_soup_from_saved_html(file_path):

    index_file = open(file_path)
    index_content = index_file.read()
    soup = BeautifulSoup(index_content, 'html.parser')

    return soup


def get_soup_from_internet(web_url):

    try:
        with urllib.request.urlopen(web_url, timeout=CONNECTION_TIME_LIMIT) as url:
            html = url.read()
        soup = BeautifulSoup(html)
    except (HTTPError, URLError) as error:
        print('[ERROR] Data not retrieved because {}\nURL: {}'.format(error, web_url))
        return None
    except timeout:
        print('[ERROR] socket timed out - URL {}'.format(web_url))
        return None
    else:
        print('Access successful.')

    return soup


def find_year(txt):
    year = None
    m = re.search(r'\b(19|20)\d{2}\b', txt)
    if m:
        year = m.group()
        return year
    date_formats = ["%d-%m-%y", "%d-%m-%Y", "%m-%d-%y", "%m-%d-%Y", "%m/%d/%Y", "%d/%m/%Y", "%m/%d/%y", "%d/%m/%y"]
    m = re.search(r'\d?\d?\d?\d+[\/\.\-]?\d?\d+[\/\.\-]?\d?\d?\d?\d+', txt)
    if m:
        year_txt = m.group()
        print("TRYING DATE Text:", year_txt)
        for frmt in date_formats:
            try:
                year = datetime.datetime.strptime(year_txt, frmt).strftime('%Y')
                year_int = int(year)
                if year_int < 1800 or year_int > 2020:
                    year = None
            except:
                # try next format
                continue

    return year


def get_taxon_details(path):

    print(path)
    collection_date = None
    other_date = None
    address_str = None
    description = None
    lat = None
    long = None
    image_url = None

    taxon_soup = get_soup_from_internet(path)
    if taxon_soup is None:
        return collection_date, address_str, lat, long, description, image_url

    # taxon_soup = get_soup_from_saved_html(LOCAL_FILE_TAXON_DETAILS_OTHER_FORMAT2)
    occurtab = taxon_soup.find(id="occurtab")
    innertext_tab = taxon_soup.find(id="innertext")
    if occurtab:
        print("============ ASU FORMAT ===========")

        whole_text = str(occurtab.encode())
        other_date = find_year(whole_text)
        print("DATE:", other_date)

        a_tags = occurtab.find_all('a')
        for a_tag in a_tags:
            a_url = a_tag.get('href')
            if a_url.lower().endswith('.jpg') or a_url.lower().endswith('.png'):
                image_url = a_url
                break


        for child in occurtab.find_all('div'):
            if len(child) > 16:
                for ch in child.children:
                    tag_str = str(ch.encode())

                    if 'Locality:' in tag_str:
                        address_str = ch.contents[2].strip()[:MAX_LOCALITY_LEN]
                        # print(re.sub(r'[\\t+|\\n|]+', '', tag_str))
                        print("ADDRESS:", address_str)
                        if ch.next_sibling:
                            coordinate_div = ch.next_sibling.next_sibling
                            if coordinate_div is not None:
                                coords = coordinate_div.get_text().strip().split()
                                n = len(coords)
                                try:
                                    for i in range(n-1):
                                        a = to_float(coords[i])
                                        b = to_float(coords[i+1])
                                        if a>=-90.0 and a<=90.0 and b>=-180 and b<=180:
                                            lat, long = a, b
                                            print("LAT:", lat)
                                            print("LONG:", long)
                                            break
                                except Exception as e:
                                    track = traceback.format_exc()
                                    print(track)
                    if 'Description:' in tag_str:
                        description = ch.contents[2].strip()
                        print("DESCRIPTION:", description)

                    #st = "<div style=\"margin-left:10px;\">30.86328 -115.2248</div>"

    elif innertext_tab:
        print("========== NON ASU FORMAT ==========")

        whole_text = str(innertext_tab.encode())
        other_date = find_year(whole_text)
        print("DATE:", other_date)

        main_div = innertext_tab.find_all('div')[4]
        # divs = main_div.find_all('div')
        divs = main_div.contents[3].find_all('div')

        for d in divs:
            tag_str = d.get_text()

            if tag_str is not None:

                tag_str = tag_str.strip()
                # print(tag_str)
                if 'Date:' in tag_str:
                    m = re.search(r'\b(19|20)\d{2}\b', tag_str)
                    if m:
                        collection_date = m.group()
                        print("DATE:", collection_date)

                if 'Locality:' in tag_str:
                    address_str = tag_str[10:].strip()[:MAX_LOCALITY_LEN]
                    print("ADDRESS:", address_str)

                if 'Description:' in tag_str:
                    description = tag_str[12:]
                    print("DESCRIPTION:", description)

                m = re.search(r'\b(19|20)\d{2}\b', tag_str)
                if m:
                    other_date = m.group()


    if collection_date is None:
        collection_date = other_date

    print(image_url)

    return collection_date, address_str, lat, long, description, image_url


def taxon_acceptable(tx):
    if None in tx[0:4]:
        return False
    return True


def get_individual_taxon_info(taxon_path):
    print(taxon_path)
    taxon_details = None

    taxon_soup = get_soup_from_internet(taxon_path)
    # taxon_soup = get_soup_from_saved_html(taxon_path)
    if taxon_soup is None:
        return taxon_details

    # print(taxon_soup.contents)
    main_image_div = taxon_soup.find(id="centralimage")
    if main_image_div == None:
        print("== NO DETAILS ==")
        return None

    try_count = 0
    a_tags = main_image_div.find_all('a')
    for a_tag in a_tags:
        # print(str(a_tag.encode(formatter=None)))

        image_details_url = a_tag.get('href')
        if image_details_url.startswith("../"):
            image_details_url = image_details_url.replace("../", "http://swbiodiversity.org/seinet/")
        taxon_details = get_taxon_details(image_details_url)
        try_count = try_count + 1
        if try_count > MAX_TRY_PER_TAXON or taxon_acceptable(taxon_details):
            print(taxon_details, " --> ACCEPTABLE")
            break
        print(taxon_details, " --> NOT ACCEPTABLE")
        ## keep trying until an acceptable taxon is found

    return taxon_details


def extract_taxons(soup):
    """
    From the given soup of the index page, it parses the taxon IDs and names. Then it visits the pages for individual taxons.
    :return: dictionary of taxons with information
    """
    global count

    TAXONS = {}
    TAXON_IDS = []
    a_tags = soup.find_all('a')
    random.shuffle(a_tags)
    for a in a_tags:
        link = str(a.encode(formatter=None))
        if "openTaxonPopup" in link:
            try:
                id = re.search(r'\d+', link).group()
                taxa = a.get_text()

                taxon_page_url = TAXON_URL_PREFIX + id #urllib.parse.quote(taxa)
                print("-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-")
                taxon_details = get_individual_taxon_info(taxon_page_url)
                # taxon_details = get_individual_taxon_info(LOCAL_FILE_TAXON_CYLINDROPUNTIA_RAMOSISSIMA)
                print("-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-**-")
                if taxon_details is None:
                    continue

                TAXON_IDS.append(id)
                if taxon_acceptable(taxon_details):
                    taxon_details = taxon_details +(id,)
                    TAXONS[taxa] = taxon_details
            except Exception as e:
                track = traceback.format_exc()
                print(track)

            count = count+1
            if count >= DATA_LIMIT:
                break;

    return TAXONS


index_soup = get_soup_from_saved_html(LOCAL_FILE_PATH)
# index_soup = get_soup_from_internet(SEINET_WEB_URL)
# print(index_soup.prettify())

taxon_dict = extract_taxons(index_soup)
print(taxon_dict)
image_dict = {}
for k in taxon_dict:
    print("----------------------------------------------------")
    print("NAME:", k)
    desc = taxon_dict[k]
    if desc != None:
        # print("ID:", taxon_dict[k][0])
        print("DATE:", desc[0])
        print("ADDRESS:", desc[1])
        print("LAT:", desc[2])
        print("LONG:", desc[3])
        print("DESCRIPTION:", desc[4])
        print("IMAGE: ", desc[5])
        image_dict[k] = (desc[6], desc[5])   ## Image URL
    print("----------------------------------------------------")

print("_____________________________________________________________________")
print("Total number of Taxons extracted: ", len(taxon_dict))
print("_____________________________________________________________________")


df = pd.DataFrame.from_dict(taxon_dict, orient="index")
df.to_csv("temp.csv")

df2 = pd.DataFrame.from_dict(image_dict, orient="index")
df2.to_csv("image_urls.csv")
