import React, { useRef } from "react";
import Navigation from "../Components/Navigation";
import DashbordCard from "./DashbordCard";
import { Button } from "@mui/material";
import ReactToPrint from "react-to-print";
import Printtemplate from "./Printtemplate";
import EinvoiceTemplate from "./Printtemplate";

const Home = () => {
  const componentRef = useRef();
  return (
    <>
      <Navigation />
      <ReactToPrint
        trigger={() => (
          <Button variant="contained" color="primary">
            Print
          </Button>
        )}
        content={() => componentRef.current}
      />
      <EinvoiceTemplate ref={componentRef} />
      {/* <DashbordCard /> */}
    </>
  );
};

export default Home;
