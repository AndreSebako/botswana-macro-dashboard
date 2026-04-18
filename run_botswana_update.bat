@echo off
cd /d C:\Users\aslil\OneDrive\Desktop\botswana-macro-starter\botswana-macro-dashboard

call python scripts\fetch_fx_api.py
call python scripts\process_botswana_csv.py