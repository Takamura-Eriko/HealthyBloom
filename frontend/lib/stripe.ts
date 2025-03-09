// This is a mock implementation for preview purposes
export const stripePromise = Promise.resolve({
  elements: () => ({
    create: () => ({
      mount: () => {},
      on: () => {},
      unmount: () => {},
    }),
  }),
  confirmCardPayment: () => Promise.resolve({ paymentIntent: { status: "succeeded" } }),
})

