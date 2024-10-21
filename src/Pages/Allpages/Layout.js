import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header";

const Layout = () => {
  return (
    <>
      <div id="layout-wrapper">
        <Header />
        <Container>
          <Row className="pt-4 justify-content-center">
            <Outlet />
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Layout;
