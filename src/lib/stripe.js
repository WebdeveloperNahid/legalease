import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const PLAN_PRICE_ID = {
    '6a3d9d7c6a12b42abc5dbdf8':'price_1TmKuLFuNUZ2NS8A5NY8XJ6y',
    "6a36ac18961bfbac89fcb542":"price_1TmOwhFuNUZ2NS8AnKXqtDp3",
    "6a3d84e8ee6cc1791ab7105f":"price_1TmP08FuNUZ2NS8ALfglCdCZ",
    "6a3dddc7cd44058559280386":"price_1TmP3yFuNUZ2NS8AucQxiRaa" ,
    "6a3de033cd44058559280387":"price_1TmPIsFuNUZ2NS8AyJ6z8DIV",
    "6a3de04fcd44058559280388": "price_1TmPLLFuNUZ2NS8AOHueP9b5"

}