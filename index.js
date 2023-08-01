const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { Bot } = require("grammy");
require('dotenv').config()
const bot = new Bot(process.env.SECRET_KEY); // <-- put your bot token between the "" (https://t.me/BotFather)
const chatIds = [982108391, 5680609646];
bot.command("start", (ctx) => {ctx.reply('Bote Temburxwaz destpekir...')});

bot.on("message", async (ctx) =>  {
    const chatId = ctx.message.chat.id
    message = await ctx.message.text
    var dizi = message.split(';')
        if(message=='zinar' || message == 'Zinar' || message == 'ZINAR'){
            ctx.reply('Keremke zinar qurban')
            await bot.api.sendMessage(982108391, 'IDsi: ' + chatId + ' mesaj: ' + message)
        }else if (message == 'çi dikî' || message == 'ci diki' || message == 'çitkî' || message == 'Çi dikî' || message == 'napiyon' || message == 'napyon' || message == 'Çi dikî?'){
            ctx.reply('Kod dinivîsim tu çi dikî?')
            await bot.api.sendMessage(982108391, 'IDsi: ' + chatId + ' mesaj: ' + message)
        }else if(dizi[0] == 'tembur'|| dizi[0] == 'tembur' || dizi[0] == 'TEMBUR'){
            await bot.api.sendMessage(5680609646, dizi[1])
        }
        else {
            if(chatId == 5680609646) {
                await bot.api.sendMessage(982108391, 'IDsi: ' + chatId + ' Tembur: ' + message)
            }else {
                await bot.api.sendMessage(982108391, 'IDsi: ' + chatId + ' mesaj: ' + message)
            }            
         }
} );
bot.start();

async function scrollDownToBottom(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        const distance = 100;
        const delay = 100;
  
        const scrollInterval = setInterval(() => {
          const scrollableElement = document.documentElement;
          const scrollHeight = scrollableElement.scrollHeight;
          const clientHeight = scrollableElement.clientHeight;
          const scrolledHeight = window.scrollY;
  
          if (scrolledHeight + clientHeight >= scrollHeight) {
            clearInterval(scrollInterval);
            resolve();
          } else {
            window.scrollBy(0, distance);
          }
        }, delay);
      });
    });
  }
  





function wait5Minutes() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1 * 60 * 1000);
    });
  }
  



  async function sendMessageToBot(message) {
    try {
      for (const chatId of chatIds) {
        await bot.api.sendMessage(chatId, message);
      }
    } catch (error) {
      console.error('Mesaj gönderirken bir hata oluştu:', error);
    }
  }
  















const sentProductTitles = [];

async function main() {
    while (true) {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const links = [
          'https://emagaza.darphane.gov.tr/diger-hatira-para',
          'https://emagaza.darphane.gov.tr/bronz',
          'https://emagaza.darphane.gov.tr/hatira-para-seti',
          'https://emagaza.darphane.gov.tr/gumus-hatira-para'
        ];
  
        for (const link of links) {
          await page.goto(link);
          await page.waitForTimeout(3000);
          await scrollDownToBottom(page);
          await page.waitForTimeout(2000);
          await scrollDownToBottom(page);
          await page.waitForTimeout(2000);
          await scrollDownToBottom(page);
  
          const productData = await page.evaluate(() => {
            const productElements = document.querySelectorAll('.product-collection');
            let products = [];
    
            for (const element of productElements) {
              const alertDiv = element.querySelector('.product-alert');
              const button = element.querySelector('.product-collection__button-add-to-cart button');
              if (alertDiv || (button && button.hasAttribute('disabled'))) continue;
    
              const titleElement = element.querySelector('.product-collection__title a');
              const priceElement = element.querySelector('.product-collection__price .money');
    
              if (titleElement && priceElement) {
                const title = titleElement.innerText.trim();
                const link = titleElement.getAttribute('href');
                const price = priceElement.innerText.trim();
                products.push({ title, link, price });
              }
            }
    
            return products;
          });
  
          let messageConsole = `Data for link: ${link}\n`;
          console.log(messageConsole);
          for (const product of productData) {
            if (!sentProductTitles.includes(product.title)) {
              let message = `NAME: ${product.title}\nLINK: ${product.link}\nPRICE: ${product.price}\nSTATUS: Di Stokê da ye ✅\n\n`;
              await sendMessageToBot(message);
              sentProductTitles.push(product.title);
            }
          }
        }
  
        await browser.close();
      } catch (error) {
        console.error('Hata:', error);
      }
        await wait5Minutes();
    }
  }
  
  main().catch((error) => {
    console.error("Bir hata oluştu:", error);
  });