import { Button } from "@mui/material";
import React from "react";

const SearchFilterPanel = () => {
  /*
    The filters should be the properties of the model object.
    */
  return (
    <div>
      <div>
        Encounter
        <Button>Title</Button>
        <Button>Date</Button>
        <Button>Location</Button>
        <Button>Description</Button>
      </div>
      <div>
        Person
        <Button>First name</Button>
        <Button>Last name</Button>
        <Button>Birthday</Button>
        <Button>Gender</Button>
        <Button>Location</Button>
        <Button>Importance level</Button>
        <Button>First met</Button>
        <Button>How we met</Button>
        <Button>Interests</Button>
        <Button>Organisation</Button>
      </div>
    </div>
  );
};

export default SearchFilterPanel;
