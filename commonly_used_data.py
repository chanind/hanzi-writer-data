import json, shutil


characters = [] # 创建一个列表用于保存汉字字符
for i in range(176, 216):
    s = bytes([i])
    for x in range(161, 255):
        s += bytes([x])
        try:
            c = s.decode("gb2312")
        except:
            break
        characters.append(c)
        # print(c, end="\t") # 打印结果
        s = bytes([i])
        hz_json = ["\\hanzi-writer-data-master\\data\\",c,".json"]
        shutil.copy("".join(hz_json),'.\data')

print(len(characters)) # 打印结果数量

filename = "common_chinese_characters.json"
with open(filename, "w", encoding="utf-8") as f:
    json.dump(characters, f, ensure_ascii=False)



