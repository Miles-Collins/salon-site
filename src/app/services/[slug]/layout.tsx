import { Metadata } from "next";
import { getSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = getSupabaseClient();
    
    const { data: service } = await supabase
      .from("service_details")
      .select("service_name, description, category")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .single();

    if (!service) {
      return {
        title: "Service Not Found",
      };
    }

    const title = `${service.service_name} | Porscha's Salon`;
    const description = service.description || `Expert ${service.service_name.toLowerCase()} services in Leavenworth, KS. Professional hair care by Porscha.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://porschas-salon.com/services/${params.slug}`,
        siteName: "Porscha's Salon",
        type: "website",
        images: [
          {
            url: `/api/og?page=service&service=${encodeURIComponent(service.service_name)}`,
            width: 1200,
            height: 630,
            alt: service.service_name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`/api/og?page=service&service=${encodeURIComponent(service.service_name)}`],
      },
    };
  } catch (error) {
    // During build without Supabase, return default metadata
    return {
      title: "Service | Porscha's Salon",
      description: "Professional hair services in Leavenworth, KS.",
    };
  }
}

export default function ServiceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
