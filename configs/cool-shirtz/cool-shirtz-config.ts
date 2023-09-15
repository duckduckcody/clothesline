import { CategoryMap } from "../../types/CategoryMap";
import { CheerioCrawlerConfig } from "../../types/CrawlerConfig";
import { productSchema } from "../../types/Product";
import { Size, sizeSchema } from "../../types/Size";
import { incrementPageParam } from "../../utils/increment-page-param/increment-page-param";
import { logBadProduct } from "../../utils/logging";
import { makeCategories } from "../../utils/makeCategories";
import { protocolAbsolute } from "../../utils/protocol-absolute/protocol-absolute";
import { stringToPrice } from "../../utils/stringToPrice";
import osmosis from "osmosis";

const categoryMap: CategoryMap = new Map();
categoryMap
  // .set("https://shirtz.cool/collections/t-shirts", {
  //   category: ["t-shirts"],
  //   gender: ["Mens", "Womens"],
  // });
  // .set("https://shirtz.cool/collections/button-up-shirts", {
  //   category: ["t-shirts"],
  //   gender: ["Mens", "Womens"],
  // })
  // .set("https://shirtz.cool/collections/longsleeve", {
  //   category: ["t-shirts"],
  //   gender: ["Mens", "Womens"],
  // })
  .set("https://shirtz.cool/collections/jumpers", {
    category: ["jumpers"],
    gender: ["Mens", "Womens"],
  });
// .set("https://shirtz.cool/collections/crop-tops", {
//   category: ["t-shirts", "crop-tops"],
//   gender: ["Womens"],
// })
// .set("https://shirtz.cool/collections/jackets", {
//   category: ["jackets"],
//   gender: ["Mens", "Womens"],
// })
// .set("https://shirtz.cool/collections/pants", {
//   category: ["pants"],
//   gender: ["Mens", "Womens"],
// });

export const coolShirtzConfig: CheerioCrawlerConfig = {
  options: {
    maxConcurrency: 4,
  },

  type: "cheerio",
  name: "Cool Shirtz",
  baseUrl: "https://shirtz.cool",
  categoryUrls: [...categoryMap.keys()],

  shouldEnqueueLinks: (url) => !url.includes("products"),
  enqueueSelector: "a.grid-view-item__link",

  maximumProductsOnPage: 15,
  getNextPageUrl: (url) => incrementPageParam(url, "page"),

  scrape: async ($, url) => {
    const splitUrl = url.split("/");
    const categories = [splitUrl[splitUrl.indexOf("collections") + 1]];

    let genders = ["Mens", "Womens"];
    if (categories?.[0] === "crop-tops") {
      genders = ["Womens"];
    }

    const product = $("div.product-single");

    const name = $(product.find("h1.product-single__title").first()).text();
    console.log("CHEERIO NAME", name);

    const images: string[] = [];
    // @ts-ignore
    product.find("a.product-single__thumbnail").each((i, el) => {
      const image = protocolAbsolute($(el).attr("data-imagesrc"));
      if (image) {
        images.push(image);
      }
    });

    const moneyElements = $(
      product.find("p.product-single__price").first()
    ).find("span.money");
    const oldPrice = stringToPrice($(moneyElements[1]).text());
    const price = stringToPrice($(moneyElements[0]).text());

    const sizes: Size[] = [];
    // @ts-ignore
    $(product.find(".swatch-element")).each((i, s) => {
      const sizeParse = sizeSchema.safeParse({
        label: $(s).text(),
        inStock: !$(s).hasClass("soldout"),
        price: price,
        oldPrice: oldPrice,
      });

      if (sizeParse.success) {
        sizes.push(sizeParse.data);
      } else {
        logBadProduct(sizeParse.error, {
          message: "error making styles for cools shirtz",
        });
      }
    });

    // clean up details
    product.find("div#product-description br").replaceWith(" ");
    // @ts-ignore
    product.find("div#product-description li").replaceWith((i, text) => {
      return ` ${$(text).text()} `;
    });
    const details = product
      .find("div#product-description")
      .text()
      .trim()
      .replace(/\s\s+/g, " ");

    const parseRes = productSchema.safeParse({
      link: url,
      name,
      brand: coolShirtzConfig.name,
      details,
      images,
      sizes,
      genders,
      categories: makeCategories(categories),
      website: coolShirtzConfig.name,
    });

    osmosis
      // @ts-ignore
      .parse($.html())
      .set({
        link: url,
        name: "h1[@class='product-single__title']",
        brand: coolShirtzConfig.name,
        details: "div[@id='product-description']",
        images: ["a.product-single__thumbnail@data-imagesrc"],
        price: "p.product-single__price//span[2]",
        oldPrice: "p.product-single__price//s",
        sizes: {
          label: ".swatch-element",
          inStock: ".swatch-element:not(.soldout)",
          price: "p.product-single__price//span[2]",
          oldPrice: "p.product-single__price//s",
        },
      })
      // @ts-ignore
      .data(function (product) {
        console.log(product);
      });

    // ['img@src']

    if (parseRes.success) {
      return parseRes.data;
    } else {
      await logBadProduct(parseRes, { name, url });
      return undefined;
    }
  },
};
