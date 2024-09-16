
/**
 * @jest-environment node
 */
import axios from 'axios'
describe('Testing auth System', () => {
    it('login api returns valid status', async () => {
        let res = await axios.post("http://localhost:3000/api/auth/login",
            JSON.stringify({
                user: "michael", password: "1234"
            }),
        )
        expect(res.status).toBe(200);
    })

    it('returns cookie', async () => {
        let res = await axios.post("http://localhost:3000/api/auth/login",
            JSON.stringify({
                user: "michael", password: "1234"
            }),
        )
        expect(res.headers['set-cookie']).not.toBeNull();
    })

    it('access a protected endpoint with correct permission', async () => {
        let { headers } = await axios.post("http://localhost:3000/api/auth/login",
            JSON.stringify({
                user: "michael", password: "1234"
            })

        )
        let res = await axios.get("http://localhost:3000/api/users",
            { withCredentials: true, headers: { "Cookie": headers['set-cookie'][0] } },

        )
        expect(res.status).toBe(200);
    }),

    it('access a protected endpoint with wrong permission', async () => {
        let status
        let { headers } = await axios.post("http://localhost:3000/api/auth/login",
            JSON.stringify({
                user: "michael", password: "1234"
            })

        )
        try {
            let res = await axios.get("http://localhost:3000/api/devices",
                { withCredentials: true, headers: { "Cookie": headers['set-cookie'][0] } },

            )
        } catch (error) {
            status = error.status
        }
        expect(status).toBe(403);
    })
    it('access a protected endpoint without permission', async () => {
        let status
        try {
            let res = await axios.get("http://localhost:3000/api/devices",
                { withCredentials: true },

            )
        } catch (error) {
            status = error.status
        }
        expect(status).toBe(401);
    })
})
