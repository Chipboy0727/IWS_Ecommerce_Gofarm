import { redirect } from "next/navigation";

type ShopProductRedirectPageProps = {
  params: {
    slug: string;
  };
};

export default function ShopProductRedirectPage({ params }: ShopProductRedirectPageProps) {
  redirect(`/product/${params.slug}`);
}
