import 'server-only'
import Stripe from 'stripe'



export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const PLAN_PRICE_ID = {
    '6a3e019f092380dd4ec1e630':'price_1TmRZrFuNUZ2NS8AECZIQhWX',
    "6a36ac18961bfbac89fcb542":"price_1TmOwhFuNUZ2NS8AnKXqtDp3",
    "6a3d84e8ee6cc1791ab7105f":"price_1TmP08FuNUZ2NS8ALfglCdCZ",
    "6a3dddc7cd44058559280386":"price_1TmP3yFuNUZ2NS8AucQxiRaa" ,
    "6a3de033cd44058559280387":"price_1TmPIsFuNUZ2NS8AyJ6z8DIV",
    "6a3de04fcd44058559280388": "price_1TmPLLFuNUZ2NS8AOHueP9b5",
    "6a3e3e0d79dc9af9ab997b2c":"price_1TmVhGFuNUZ2NS8AYl2QzjTY",
    "6a3e72b6a6e99ae646a14ac1":"price_1TmZ6tFuNUZ2NS8ASnOjZ4T7",
    "6a3e81a5a6e99ae646a14af5":"price_1Tma4CFuNUZ2NS8ALmbwlgOF",
    "6a3f45ef0fc16ff941708a74":"price_1TmnMrFuNUZ2NS8AZ2bD9YkF"

}