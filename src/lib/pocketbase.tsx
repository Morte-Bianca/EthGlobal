import PocketBase from 'pocketbase';
export const runtime = 'experimental-edge';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API_URL);

if (process.env.NODE_ENV === 'development') pb.autoCancellation(false);
/* console.log('process.env.NEXT_PUBLIC_POCKETBASE_API_URL', process.env.NEXT_PUBLIC_POCKETBASE_API_URL ); */

export default pb;
