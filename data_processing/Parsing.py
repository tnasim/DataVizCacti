import math
import os
import re

# Set the directory you want to start from
rootDir = './images'
for dirName, subdirList, fileList in os.walk(rootDir):

    directoryName = dirName.split("./images/")
    directoryName = list(filter(None, directoryName))[0]

    print('\nFound directory: %s' % directoryName)
    for fname in fileList:
        if(fname.endswith(".txt")):
            print('\t%s' % fname)
            with open(dirName + "/" + fname) as f:
                content = f.readlines()
            content = [x.strip() for x in content]
            print(fname)
            for line in content:
                # print(line)
                if("http://" not in line and "https://" not in line):
                    # Might need additional check
                    date = re.findall(r"\d{4}", line)
                    if(len(date) > 0):
                        date = int(date[0])
                        if(int(date) >= 1900 and int(date) <= 2020):
                            print("** YEAR: ", date)

                if line.startswith("Locality") or line.startswith("Location"):
                    LOC_NAME = line[line.index(':')+1:].strip()
                    print("LOC:", LOC_NAME)
                if line.startswith("Manager") or line.startswith("Date"):
                    pass
            print("-----------------------------------------------------")
