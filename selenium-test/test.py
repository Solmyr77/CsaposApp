from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()

driver.get("http://localhost:3000")

time.sleep(1)

driver.save_screenshot("./Frontend/selenium-test/login.png")

username = driver.find_element(By.NAME, "username")
username.send_keys("vizsga01")

password = driver.find_element(By.NAME, "password")
password.send_keys("Vizsga01")

button = driver.find_element(By.TAG_NAME, "button")
button.click()

time.sleep(8)

driver.save_screenshot("./Frontend/selenium-test/main.png")

print("sikeres bejelentkezés")

driver.quit()