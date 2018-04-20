import os
L=[]
def file_name(file_dir):
	for root,dirs,files in os.walk(file_dir):
		for file in files:
			if os.path.splitext(file)[1] == '.json':
				L.append(file)


file_name('/Users/yangkaihong/Desktop/5347/Assignment2/COMP5347-master/revisions')

# print(L)

for i in range(0,len(L)):
	L[i] = L[i].replace(" ","\ ")
	L[i] = L[i].replace("(","\(")
	L[i] = L[i].replace(")","\)")

# print(L)

for item in L:
	command_line = "cd /Applications/mongodb/bin \n ./mongoimport --jsonArray --db WAD --collection articles < /Users/yangkaihong/Desktop/5347/Assignment2/COMP5347-master/revisions/"
	command_line = command_line + item
	os.system(command_line)

