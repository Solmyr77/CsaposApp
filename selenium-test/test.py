from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()

driver.get("https://csaposapp.hu")

time.sleep(3)

driver.save_screenshot("./Frontend/selenium-test/login.png")

username = driver.find_element(By.NAME, "username")
username.send_keys("vizsga01")

password = driver.find_element(By.NAME, "password")
password.send_keys("Vizsga01")

button = driver.find_element(By.TAG_NAME, "button")
button.click()

time.sleep(8)

driver.save_screenshot("./Frontend/selenium-test/main.png")

navigation_button = driver.find_element(By.ID, "search")
navigation_button.click()

time.sleep(3)

searchbar = driver.find_element(By.TAG_NAME, "input")
searchbar.send_keys("p")

time.sleep(3)

print("Sikeres keresés ✅")
driver.save_screenshot("./Frontend/selenium-test/search result.png")


print("Sikeres bejelentkezés ✅")

driver.quit()