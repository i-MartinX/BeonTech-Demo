import { BookingApi } from '../../api/booking.api'
import bookingPayload from '../../../data/booking.json'

describe('Restful-Booker: booking lifecycle', () => {
  const updatedCheckout = '2026-02-10'

  it('authenticates, creates, reads, updates and deletes a booking', () => {
    // 1. Auth: keep the token as an alias for later steps
    BookingApi.auth()
      .then((res) => {
        expect(res.status, 'auth status').to.eq(200)
        expect(res.body.token, 'auth token').to.be.a('string').and.not.be.empty
        return res.body.token
      })
      .as('token')

    // 2. Create: keep the booking ID as an alias
    BookingApi.create(bookingPayload)
      .then((res) => {
        expect(res.status, 'create status').to.eq(200)
        expect(res.body.bookingid, 'bookingid').to.be.a('number')
        expect(res.body.booking.firstname).to.eq(bookingPayload.firstname)
        return res.body.bookingid
      })
      .as('bookingId')

    // 3. Read: uses the ID from step 2 and checks the stored data
    cy.get<number>('@bookingId').then((id) => {
      BookingApi.get(id).then((res) => {
        expect(res.status, 'read status').to.eq(200)
        expect(res.body.firstname).to.eq(bookingPayload.firstname)
        expect(res.body.lastname).to.eq(bookingPayload.lastname)
        expect(res.body.bookingdates.checkout).to.eq(bookingPayload.bookingdates.checkout)
      })
    })

    // 4. Update: uses the token and ID, then confirms the change with a GET
    cy.get<string>('@token').then((token) => {
      cy.get<number>('@bookingId').then((id) => {
        const updated = {
          ...bookingPayload,
          bookingdates: { ...bookingPayload.bookingdates, checkout: updatedCheckout },
        }
        BookingApi.update(id, token, updated).then((res) => {
          expect(res.status, 'update status').to.eq(200)
          expect(res.body.bookingdates.checkout, 'checkout in PUT response').to.eq(updatedCheckout)
        })
        BookingApi.get(id).then((res) => {
          expect(res.body.bookingdates.checkout, 'checkout after GET').to.eq(updatedCheckout)
        })
      })
    })

    // 5. Delete: the challenge expects 201, then a GET must return 404
    cy.get<string>('@token').then((token) => {
      cy.get<number>('@bookingId').then((id) => {
        BookingApi.delete(id, token).then((res) => {
          expect(res.status, 'delete status').to.eq(201)
        })
        BookingApi.get(id).then((res) => {
          expect(res.status, 'GET after delete').to.eq(404)
          expect(res.body, 'not-found body').to.include('Not Found')
        })
      })
    })
  })
})
