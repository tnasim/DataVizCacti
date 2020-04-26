import urllib
import urllib.request
import urllib.parse
from urllib.error import HTTPError, URLError
from socket import timeout
import pandas as pd
from pathlib import Path

import time
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

# import wx


IMG_DIR = "output/"
CONNECTION_TIME_LIMIT = 5
IMAGE_URL_FILE = "image_urls.csv"

def read_urls_from_csv(path):
    df = pd.read_csv(path, usecols=['name', 'id', 'url'])
    count = 1
    for _, row in df.iterrows():
        print(count)
        if row['url'] and row['url'] == row['url']: # NaN check
            download_images(row['url'], row['name'], IMG_DIR)
        count = count + 1

def download_images(img_url, name, dir_path):
    print(name, img_url)
    try:
        save_location = dir_path + '/' + name
        Path(save_location).mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(img_url, save_location + '/' + '1.jpg')
    except Exception as error:
        print('[ERROR] Data not retrieved because {}\nURL: {}'.format(error, img_url))
        return None
    print('ok')


def update_image_type(data_path, new_path):
    """
    This helper method is used to display an image to the user and get feedback from the user whether that image contains flower or not.
    :param data_path: csv file to read the data from
    :param new_path: csv file output
    :return: None
    """
    df = pd.read_csv(data_path, usecols=['Species','years','place','lattitude','Longitude','Description','Url'])
    count = 1
    is_flower = []
    predict = []
    for _, row in df.iterrows():
        print(row['Species'])
        predict.append(0)
        image_path = 'output/' + row['Species'] + '/' + '1.jpg'
        try:
            img = mpimg.imread(image_path)
            imgplot = plt.imshow(img)
            plt.show()

            v = int(input('is' + row['Species'] + 'a flower?'))
            if v == 1:
                print(row['Species'], "is", 'flower')
            if v == 0:
                print(row['Species'], "NOT", 'flower')
            is_flower.append(v)

        except:
            print("Error loading image for:", image_path)
            is_flower.append(0)

    df['TRUE'] = is_flower
    df['Prediction'] = predict
    df.to_csv(new_path)


update_image_type('dataset.csv', 'dataset_new.csv')
