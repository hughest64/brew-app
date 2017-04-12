# testing playground for knights who say 'ni'
myDict = ({'boil':{'60':[('Perle', '2.0', '60', 'boil')],
                  '20':[('Cascase', '1.0', '20', 'boil')],
                  '0':[('Citra', '3.0', '0', 'boil')]}})

print myDict
#print myDict['boil']

for hop in myDict['boil'].values():
    print hop[0]

for hop in sorted(myDict['boil'], reverse=True):
    print myDict['boil'][hop][0]
