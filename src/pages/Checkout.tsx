import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { createCheckoutSession } from "@/lib/api";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    projectAddress: "",
    notes: "",
  });

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [items]
  );

  useEffect(() => {
    if (searchParams.get("success")) clearCart();
  }, [clearCart, searchParams]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      setStatus("error");
      return;
    }
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setErrorMessage("Please enter the buyer name, email and phone number.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const session = await createCheckoutSession({
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        customer,
      });

      window.location.href = session.url;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setStatus("error");
    }
  };

  if (searchParams.get("success")) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <section className="container mx-auto max-w-2xl px-6 py-32 text-center">
          <ShieldCheck className="mx-auto mb-6 h-12 w-12 text-gold" />
          <h1 className="mb-4 font-display text-4xl text-foreground">Payment received</h1>
          <p className="mb-8 font-body text-muted-foreground">
            Thank you. Alpuz will follow up with your order details shortly.
          </p>
          <Button asChild className="bg-gradient-gold text-primary">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="container mx-auto grid max-w-5xl gap-10 px-6 py-28 lg:grid-cols-[1fr_380px]">
        <div>
          <Button asChild variant="ghost" className="mb-6 px-0">
            <Link to="/shop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to shop
            </Link>
          </Button>

          <h1 className="mb-3 font-display text-4xl text-foreground">Checkout</h1>
          <p className="mb-8 max-w-xl font-body text-muted-foreground">
            Add the buyer details, review the order, then continue to Stripe for secure payment.
          </p>

          {searchParams.get("canceled") && (
            <div className="mb-6 rounded-md border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-foreground">
              Payment was canceled. Your cart is still here.
            </div>
          )}

          {status === "error" && errorMessage && (
            <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {items.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="mb-6 font-body text-muted-foreground">Your cart is empty.</p>
              <Button asChild className="bg-gradient-gold text-primary">
                <Link to="/shop">Browse shop</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-gold" />
                  <h2 className="font-display text-2xl text-foreground">Buyer details</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="buyer-name">Full name</Label>
                    <Input
                      id="buyer-name"
                      value={customer.name}
                      onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-email">Email</Label>
                    <Input
                      id="buyer-email"
                      type="email"
                      value={customer.email}
                      onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-phone">Phone</Label>
                    <Input
                      id="buyer-phone"
                      value={customer.phone}
                      onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))}
                      autoComplete="tel"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-address">Project address</Label>
                    <Input
                      id="project-address"
                      value={customer.projectAddress}
                      onChange={(event) =>
                        setCustomer((current) => ({ ...current, projectAddress: event.target.value }))
                      }
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="project-notes">Notes</Label>
                    <Textarea
                      id="project-notes"
                      value={customer.notes}
                      onChange={(event) => setCustomer((current) => ({ ...current, notes: event.target.value }))}
                      rows={3}
                      placeholder="Preferred timing, unit type or any site details."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="grid grid-cols-[72px_1fr_auto] items-center gap-4 border-b border-border pb-4"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-[72px] w-[72px] rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-[72px] w-[72px] rounded-md bg-muted" />
                    )}
                    <div className="min-w-0">
                      <p className="font-body font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <p className="font-body font-semibold text-foreground">
                      ${(Number(item.price || 0) * item.quantity).toLocaleString("en-SG")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-6 shadow-card">
          <h2 className="mb-5 font-display text-2xl text-foreground">Order summary</h2>
          <div className="mb-6 space-y-3 font-body text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">${subtotal.toLocaleString("en-SG")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-semibold text-foreground">SGD</span>
            </div>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={items.length === 0 || status === "submitting"}
            className="w-full bg-gradient-gold text-primary font-semibold"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {status === "submitting" ? "Opening Stripe..." : "Pay with Stripe"}
          </Button>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Stripe will collect payment details securely. Buyer details are attached to the
            Stripe session so Alpuz can identify the order.
          </p>
        </aside>
      </section>
      <Footer />
    </main>
  );
};

export default Checkout;
