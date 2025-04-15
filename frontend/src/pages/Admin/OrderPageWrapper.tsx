import {
    PayPalScriptProvider,
  } from "@paypal/react-paypal-js";
  import { useGetPaypalClientIdQuery } from "../../redux/api/orderApiSlice";
import OrderPage from "../Orders/OrderPage";
  
  const OrderPageWrapper = () => {
    const { data: paypalData, isLoading, error } = useGetPaypalClientIdQuery({});
  
    if (isLoading) return <div>Loading PayPal...</div>;
    if (error || !paypalData?.clientId) return <div>Error loading PayPal</div>;
  
    return (
      <PayPalScriptProvider
        options={{
          clientId: paypalData.clientId,
          currency: "USD",
        }}
      >
        <OrderPage />
      </PayPalScriptProvider>
    );
  };
  
  export default OrderPageWrapper;
  