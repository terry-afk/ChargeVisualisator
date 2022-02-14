import { configureStore } from "@reduxjs/toolkit";

import { chargeApi } from "../services/chargeApi";

export default configureStore({
  reducer: {
    [chargeApi.reducerPath]: chargeApi.reducer
  }
})