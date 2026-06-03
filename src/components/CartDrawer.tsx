import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { items, itemCount, updateQuantity, removeItem } = useCart();

  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.price || "0") * i.quantity,
    0
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-6 right-6 sm:bottom-20 sm:right-6 z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-gold text-primary shadow-gold"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-gold">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display">Your Cart</SheetTitle>
          </SheetHeader>
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-muted-foreground">
              <ShoppingCart className="h-16 w-16 opacity-50" />
              <p className="font-body">Your cart is empty.</p>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link to="/shop">Browse shop</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 pr-4">
                <ul className="space-y-4 py-4">
                  {items.map((item) => (
                    <li
                      key={item.product_id}
                      className="flex gap-3 border-b border-border pb-4 last:border-0"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 shrink-0 rounded-md bg-muted" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-body font-medium text-foreground line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gold font-semibold">
                          ${item.price} × {item.quantity}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.product_id,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeItem(item.product_id)}
                            aria-label="Remove"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
              <SheetFooter className="flex-col gap-2 border-t pt-4 sm:flex-col">
                <p className="w-full text-right font-display text-lg font-semibold text-foreground">
                  Subtotal: ${subtotal.toFixed(2)}
                </p>
                <Button asChild className="w-full bg-gradient-gold text-primary font-semibold">
                  <Link to="/checkout" onClick={() => setOpen(false)}>
                    Proceed to checkout
                  </Link>
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartDrawer;
