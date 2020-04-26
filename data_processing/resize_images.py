from PIL import Image, ImageFilter
import math
import os

# Set the directory you want to start from
rootDir = './images'
for dirName, subdirList, fileList in os.walk(rootDir):

    print('Found directory: %s' % dirName)
    for fname in fileList:

        print('\t%s' % fname)

        if fname[0] == '.' or fname[1] == '.':
            continue

        im = Image.open(dirName + '/' + fname)

        box = [0, 0, im.size[0], im.size[1]]
        if im.size[0] > 180:
            d = im.size[0]-180
            box[0] = box[0] + int(math.floor(d / 2))
            box[2] = box[2] - int(math.ceil(d / 2))

        if im.size[1] > 180:
            d = im.size[1]-180
            box[1] = box[1] + int(math.floor(d / 2))
            box[3] = box[3] - int(math.ceil(d / 2))

        box = tuple(box)
        im = im.crop(box)

        im.save(dirName + '/' + fname)
        print(im.format, im.size, im.mode)
