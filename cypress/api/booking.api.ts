export interface BookingPayload {
  firstname: string
  lastname: string
  totalprice: number
  depositpaid: boolean
  bookingdates: { checkin: string; checkout: string }
  additionalneeds: string
}

const apiUrl: string = Cypress.expose('apiUrl')
const json = { Accept: 'application/json' }

// One function per endpoint. Each returns the raw cy.request chain,
// so the spec decides what to assert and which value to pass on.
export const BookingApi = {
  auth() {
    // Credentials are read with cy.env(), which is meant for sensitive values.
    return cy.env(['apiUser', 'apiPassword']).then(({ apiUser, apiPassword }) =>
      cy.request<{ token: string }>({
        method: 'POST',
        url: `${apiUrl}/auth`,
        body: { username: apiUser, password: apiPassword },
        failOnStatusCode: false,
      }),
    )
  },

  create(payload: BookingPayload) {
    return cy.request<{ bookingid: number; booking: BookingPayload }>({
      method: 'POST',
      url: `${apiUrl}/booking`,
      headers: json,
      body: payload,
      failOnStatusCode: false,
    })
  },

  get(id: number) {
    return cy.request<BookingPayload>({
      method: 'GET',
      url: `${apiUrl}/booking/${id}`,
      headers: json,
      failOnStatusCode: false,
    })
  },

  // PUT replaces the whole booking, so the full payload is sent.
  update(id: number, token: string, payload: BookingPayload) {
    return cy.request<BookingPayload>({
      method: 'PUT',
      url: `${apiUrl}/booking/${id}`,
      headers: { ...json, Cookie: `token=${token}` },
      body: payload,
      failOnStatusCode: false,
    })
  },

  delete(id: number, token: string) {
    return cy.request({
      method: 'DELETE',
      url: `${apiUrl}/booking/${id}`,
      headers: { Cookie: `token=${token}` },
      failOnStatusCode: false,
    })
  },
}
