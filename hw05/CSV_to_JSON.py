import pandas as pd
import json

csv_filename = "分組名單.csv"
url_filename = "URL.csv"
teamname_filename = "Teamname.csv"
github_account_filename = "個人github帳號.csv"
json_filename = "output.json"

# 讀取 CSV 檔案到 pandas DataFrame
csv_data = pd.read_csv(csv_filename, encoding="utf-8")
url_data = pd.read_csv(url_filename, encoding="utf-8")
teamname_data = pd.read_csv(teamname_filename, encoding="utf-8")
github_account_data = pd.read_csv(github_account_filename, encoding="utf-8")

# 將 URL 資訊轉換成字典
url_dict = dict(zip(url_data["Teamleadername"], url_data["URL"]))

# 將 Teamname 資訊轉換成字典
teamname_dict = dict(zip(teamname_data["Group"], teamname_data["Teamname"]))

# 將 github_account 資訊轉換成字典
github_account_dict = dict(zip(github_account_data["姓名"], github_account_data["GitHub"]))

csv_data["Advisor"] = csv_data["Advisor"].fillna("")

# 初始化 JSON 資料
data = {
    "leval": 1,
    "image_url": "https://static.observableusercontent.com/files/a284bc28b0b5175267fd90f4e29346b58519efadf6fee39dbd7bf806fe2e5f5b094dcfd48833e320897a42f6171e5743a014d613672df5e4746bb728890adbd8",
    "Name": "資料可視化",
    "collapsed": 'false',
    "children": []
}

current_group = None
group_data = None

# 遍歷 CSV 檔案中的資料
for index, row in csv_data.iterrows():
    if row["Group"] != current_group:
        if group_data:
            data["children"].append(group_data)
        group_data = {
            "leval": 2,
            "image_url": url_dict.get(row["Teamleadername"]),
            "Group": int(row["Group"]),
            "Teamleadername": row["Teamleadername"],
            "Teamname": teamname_dict.get(row["Group"]),
            "Team_Mileage": row["Team_Mileage"],
            "collapsed": 'false',
            "children": []
        }
        current_group = row["Group"]

    team_member = {
        "leval": 3,
        "image_url": f"https://{github_account_dict.get(row['Name'])}.github.io/vis2023f/hw00/me.jpg",
        "Group": int(current_group),
        "Department": row["Department"],
        "Classnumber": row["Classnumber"],
        "Name": row["Name"],
        "Advisor": row["Advisor"],
        "Personal_Mileage": row["Personal_Mileage"],
        "Hw1_score": row["Hw1_score"],
        "Hw2_score": row["Hw2_score"],
        "Hw3_score": row["Hw3_score"],
        "Hw4_score": row["Hw4_score"],
        "Hw5_score": row["Hw5_score"],
        "Hw6_score": row["Hw6_score"],
        "Hw7_score": row["Hw7_score"],
        "Hw8_score": row["Hw8_score"],
        "Hw9_score": row["Hw9_score"],
        "Hw10_score": row["Hw10_score"],
        "collapsed": 'false'
    }
    group_data["children"].append(team_member)

if group_data:
    data["children"].append(group_data)

# 建立JSON檔
with open(json_filename, "w", encoding="utf-8") as json_file:
    json.dump(data, json_file, indent=4, ensure_ascii=False)

print("JSON data has been successfully written to", json_filename)
