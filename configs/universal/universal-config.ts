import { utils } from 'apify';
import { Category } from '../../types/Category';
import { Config } from '../../types/Config';
import { Gender } from '../../types/Gender';
import { productSchema } from '../../types/Product';
import { getParams } from '../../utils/getParams';
import { incrementPageParam } from '../../utils/incrementPageParam';
import { logBadProduct } from '../../utils/logging';
import { makeCategories } from '../../utils/makeCategories';
import { stringToPrice } from '../../utils/stringToPrice';
import { urlToCheerio } from '../../utils/urlToCheerio';
import { getSizes } from './getSizes';

const makeGender = (sizing: string): Gender[] => {
  if (sizing.includes('She')) {
    return ['Womens'];
  } else if (sizing.includes('He')) {
    return ['Mens'];
  } else {
    return ['Womens', 'Mens'];
  }
};

const categoryMap = new Map<
  string,
  { category: Category[]; gender: Gender[] }
>();

categoryMap
  .set('https://www.universalstore.com/mens/t-shirts.html', {
    category: ['t-shirts'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/mens/jeans.html', {
    category: ['jeans'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/mens/hoodies-sweaters.html', {
    category: ['hoodies'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/mens/jackets-coats.html', {
    category: ['jackets'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/mens/overshirts.html', {
    category: ['jackets'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/mens/shirts-polos.html', {
    category: ['t-shirts'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/mens/pants.html', {
    category: ['pants'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/mens/shorts.html', {
    category: ['shorts'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/mens/muscle-shirts-singlets.html', {
    category: ['singlets'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/mens/underwear.html', {
    category: ['underwear'],
    gender: ['Mens'],
  })
  .set('https://www.universalstore.com/womens/tops.html', {
    category: ['tops'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/overshirts.html', {
    category: ['jackets'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/tshirts-tanktops.html', {
    category: ['t-shirts'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/jeans.html', {
    category: ['jeans'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/dresses.html', {
    category: ['dresses'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/sets-coordinates.html', {
    category: ['co-ords'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/jumpers-knits.html', {
    category: ['jumpers'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/coats-jackets.html', {
    category: ['jackets'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/pants.html', {
    category: ['pants'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/skirts.html', {
    category: ['skirts'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/shorts.html', {
    category: ['shorts'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/underwear.html', {
    category: ['underwear'],
    gender: ['Womens'],
  })
  .set('https://www.universalstore.com/womens/swimwear.html', {
    category: ['swimwear'],
    gender: ['Womens'],
  });

export const universalConfig: Config = {
  name: 'Universal',
  baseUrl: 'https://www.universalstore.com',
  maximumProductsOnPage: 60,
  fuckyTolerance: 5,
  categoryUrls: [...categoryMap.keys()],
  scrape: async (url: string) => {
    console.log('url', url);
    const params = getParams(url);
    const category = params.get('category')?.split(',') || [];
    const gender = params.get('gender')?.split(',') || [];

    const $ = await urlToCheerio(url);

    const product = $('#maincontent');

    const name = product
      .find('h1.product-name')
      .text()
      .trim()
      .replaceAll('\n', '');
    const brand = product.find('meta').attr('content');

    const images: string[] = [];
    product.find('img.swiper-lazy').each((i, p) => {
      const image = $(p).attr('data-src');
      if (image) {
        images.push(image);
      }
    });

    const price = stringToPrice(
      $(product.find('span.normal-price').first()).text()
    );
    const oldPrice = stringToPrice(
      $($(product.find('span.old-price').first()))
        .text()
        .replaceAll('Regular Price', '')
    );

    const sizing = $(product.find('div.description-item-content').first())
      .text()
      .trim();

    const sizes = await getSizes($, price, oldPrice);

    const parseRes = productSchema.safeParse({
      name,
      brand,
      link: url,
      details: '',
      images,
      sizing,
      gender,
      sizes,
      category: makeCategories(category),
    });

    if (parseRes.success) {
      return parseRes.data;
    } else {
      logBadProduct(parseRes, { url });
    }
  },
  shouldEnqueueLinks: (url: string) => {
    return url.includes('mens') || url.includes('womens');
  },
  enqueueLinks: async (url, requestQueue) => {
    const $ = await urlToCheerio(url);
    const res = await utils.enqueueLinks({
      $,
      requestQueue,
      limit: universalConfig.maximumProductsOnPage,
      selector: 'a.product-item-info',
      baseUrl: universalConfig.baseUrl,
      transformRequestFunction: (request) => {
        const params = new URLSearchParams();
        params.set('category', categoryMap.get(url)?.category.toString() || '');
        params.set('gender', categoryMap.get(url)?.gender.toString() || '');

        request.url = `${request.url}?${params.toString()}`;
        return request;
      },
    });
    return Boolean(res.length);
  },
  getNextPageUrl: (url: string) => incrementPageParam(url, 'p'),
};
