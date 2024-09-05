import { Form, redirect } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import { customFetch, formatPrice } from "../utils";
import { toast } from "react-toastify";
import { clearCart } from "../features/cart/cartSlice";
import { useState, useEffect } from "react";

export const action =
  (store, queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const { name, address, saveInfo } = Object.fromEntries(formData);
    const user = store.getState().userState.user;
    const { cartItems, orderTotal, numItemsInCart } =
      store.getState().cartState;

    const info = {
      name,
      address,
      chargeTotal: orderTotal,
      orderTotal: formatPrice(orderTotal),
      cartItems,
      numItemsInCart,
    };
    try {
      // Save info in localStorage if 'saveInfo' checkbox is checked
      if (saveInfo) {
        localStorage.setItem("savedInfo", JSON.stringify({ name, address }));
      }

      const response = await customFetch.post(
        "/orders",
        { data: info },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // remove query
      queryClient.removeQueries(["orders"]);
      // rest of the code
      store.dispatch(clearCart());
      toast.success("order placed successfully");
      return redirect("/orders");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        "there was an error placing your order";

      toast.error(errorMessage);
      if (error?.response?.status === 401 || 403) return redirect("/login");

      return null;
    }
  };
const CheckoutForm = () => {
  const [useSavedInfo, setUseSavedInfo] = useState(true); // Use saved info by default if available
  const [showNewInfoForm, setShowNewInfoForm] = useState(false); // Toggle new info form
  const [savedInfo, setSavedInfo] = useState(null); // Saved user info

  // Load saved info from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedInfo"));
    if (saved) {
      setSavedInfo(saved);
    }
  }, []);

  // Handle radio button change to toggle between saved and new info
  const handleInfoTypeChange = (useSaved) => {
    setUseSavedInfo(useSaved);
    setShowNewInfoForm(!useSaved); // Show the new info form if not using saved info
  };

  // Delete saved info from localStorage
  const handleDeleteSavedInfo = () => {
    localStorage.removeItem("savedInfo");
    setSavedInfo(null);
    setUseSavedInfo(false); // Show new info form if saved info is deleted
  };

  // Function to truncate and format saved info display
  const formatSavedInfo = (info) => {
    return `****${info.substring(0, 6)}...`; // Display first 10 characters followed by ellipsis
  };

  return (
    <Form method="POST" className="flex flex-col gap-y-4">
      <h4 className="font-medium text-xl">Shipping Information</h4>

      {savedInfo && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="infoType"
              checked={useSavedInfo}
              onChange={() => handleInfoTypeChange(true)}
            />

            <span>
              Use saved info:
              <input
                name="name"
                value={formatSavedInfo(savedInfo.name)}
                className="bg-transparent ml-2"
                readOnly
              />
              <input
                name="address"
                value={formatSavedInfo(savedInfo.address)}
                className="bg-transparent"
                readOnly
              />
            </span>
            <button
              type="button"
              className="text-red-500 ml-auto inline btn btn-xs text-sm"
              onClick={handleDeleteSavedInfo}
            >
              Delete
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="infoType"
              checked={!useSavedInfo}
              onChange={() => handleInfoTypeChange(false)}
            />
            <span>Enter new information</span>
          </div>
        </div>
      )}

      {/* Show form if no saved info or if user wants to enter new info */}
      {(!savedInfo || showNewInfoForm) && (
        <div
          className={`transition-[max-height] duration-[3000ms] ease-in-out overflow-hidden ${
            showNewInfoForm || !savedInfo ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <FormInput label="name" name="name" type="text" />
          <FormInput label="address" name="address" type="text" />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="saveInfo"
              className="checkbox mt-2 checkbox-primary checkbox-sm"
            />
            <span className="text-sm sm:text-base pt-2">
              Save this info for later use
            </span>
          </div>
        </div>
      )}
      <div className="mt-4">
        <SubmitBtn text="Place Your Order" />
      </div>
    </Form>
  );
};
export default CheckoutForm;

// import { Form, redirect } from "react-router-dom";
// import FormInput from "./FormInput";
// import SubmitBtn from "./SubmitBtn";
// import { customFetch, formatPrice } from "../utils";
// import { toast } from "react-toastify";
// import { clearCart } from "../features/cart/cartSlice";

// export const action =
//   (store) =>
//   async ({ request }) => {
//     const formData = await request.formData();
//     const { name, address } = Object.fromEntries(formData);
//     const user = store.getState().userState.user;
//     const { cartItems, orderTotal, numItemsInCart } =
//       store.getState().cartState;

//     const info = {
//       name,
//       address,
//       chargeTotal: orderTotal,
//       orderTotal: formatPrice(orderTotal),
//       cartItems,
//       numItemsInCart,
//     };
//     try {
//       const response = await customFetch.post(
//         "/orders",
//         { data: info },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );
//       store.dispatch(clearCart());
//       toast.success("order placed successfully");
//       return redirect("/orders");
//     } catch (error) {
//       console.log(error);
//       const errorMessage =
//         error?.response?.data?.error?.message ||
//         "there was an error placing your order";

//       toast.error(errorMessage);
//       if (error?.response?.status === 401 || 403) return redirect("/login");

//       return null;
//     }
//   };
// const CheckoutForm = () => {
//   return (
//     <Form method="POST" className="flex flex-col gap-y-4">
//       <h4 className="font-medium text-xl">Shipping Information</h4>
//       <FormInput label="first name" name="name" type="text" />
//       <FormInput label="address" name="address" type="text" />

//       <div className="mt-4">
//         <SubmitBtn text="Place Your Order" />
//       </div>
//     </Form>
//   );
// };
// export default CheckoutForm;
