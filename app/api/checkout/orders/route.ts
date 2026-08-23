import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/admin/validations";
import { createOrderId } from "@/lib/payment/orders";
import { getPaymentProvider, isDirectPaymentAvailable, isProductionMockPaymentBlocked } from "@/lib/payment/provider";
import { getSupabaseServerClient } from "@/lib/supabase";
import { SITE } from "@/config/site";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 확인해주세요." }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase 환경변수가 없어 주문을 생성할 수 없습니다." }, { status: 500 });
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("slug", parsed.data.productSlug)
    .eq("published", true)
    .maybeSingle();

  if (productError || !product) {
    return NextResponse.json({ message: "결제 가능한 상품을 찾을 수 없습니다." }, { status: 404 });
  }

  if (product.purchase_type !== "direct" || product.price === null) {
    return NextResponse.json({ message: "이 상품은 상담 후 진행되는 상품입니다." }, { status: 400 });
  }

  if (!isDirectPaymentAvailable()) {
    return NextResponse.json(
      {
        message: isProductionMockPaymentBlocked()
          ? "운영 환경에서는 테스트 결제를 사용할 수 없습니다. 결제 설정을 완료한 뒤 다시 시도해주세요."
          : "결제 설정이 완료되지 않았습니다. 상담 문의로 진행해주세요.",
      },
      { status: 503 },
    );
  }

  const orderId = createOrderId();
  const provider = getPaymentProvider();
  const amount = Number(product.price);
  const baseUrl = SITE.url.replace(/\/$/, "");
  const successUrl = `${baseUrl}/checkout/success`;
  const failUrl = `${baseUrl}/checkout/fail?orderId=${encodeURIComponent(orderId)}`;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_id: orderId,
      product_id: product.id,
      business_name: parsed.data.businessName,
      customer_name: parsed.data.customerName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      request_note: parsed.data.requestNote || null,
      amount,
      currency: "KRW",
      status: "pending",
      payment_provider: provider.name,
      utm_source: parsed.data.utmSource || null,
      utm_medium: parsed.data.utmMedium || null,
      utm_campaign: parsed.data.utmCampaign || null,
      utm_content: parsed.data.utmContent || null,
      utm_term: parsed.data.utmTerm || null,
      landing_page: parsed.data.landingPage || null,
      referrer: parsed.data.referrer || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ message: "주문을 생성하지 못했습니다." }, { status: 500 });
  }

  await provider.createPayment({
    orderId,
    orderName: product.name,
    amount,
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.email,
    successUrl,
    failUrl,
  });

  return NextResponse.json({
    ok: true,
    orderDbId: order.id,
    orderId,
    orderName: product.name,
    amount,
    customerKey: `customer_${crypto.randomUUID().replaceAll("-", "")}`.slice(0, 40),
    successUrl,
    failUrl,
    provider: provider.name,
    tossClientKey: process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || process.env.NEXT_PUBLIC_PAYMENT_CLIENT_KEY || "",
  });
}
