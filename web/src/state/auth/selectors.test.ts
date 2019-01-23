import { AccessTokenData, IdTokenData } from './';
import { accessTokenDataSelector, idTokenDataSelector } from './selectors';

describe('auth selectors', () => {
    it('accessTokenDataSelector', () => {
        const state = {
            auth: {
                accessToken:
                    'eyJraWQiOiI4N0lMLXZMdUoybXlaYkxjeWZzWDV2MDZaOXhWNWt4ajJzeF9FUG43QU1NIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULklQSnE1eEhrd181NFpwU3dya3RzOTFDYmdPbTFxSW5YdXNWb2hBRUpsQUEiLCJpc3MiOiJodHRwczovL2Rldi0zOTYxODAub2t0YXByZXZpZXcuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTU0ODI0MDI3MSwiZXhwIjoxNTQ4MjQzODcxLCJjaWQiOiIwb2FncjU4YzRuY3NDOWdyNzBoNyIsInVpZCI6IjAwdWlmcGI0cWp6c2NZb094MGg3Iiwic2NwIjpbImVtYWlsIiwib3BlbmlkIiwicHJvZmlsZSJdLCJzdWIiOiJkZWFuLnZhbm5pZWtlcmtAa3VydG9zeXMuY29tIiwiYnJhbmNoaWQiOiJjZmFhN2JmNC1iZmY4LTRjOGMtYjcxZS1mNjRiZDgyNDk3NTAiLCJzY29wZWxldmVsIjoiYnJhbmNoIn0.MM8fDqPxtZHhuyRtR4nOXcPLNhYSMT1zJWAC-hsQo86deXYHV6ph6atmbbTLS0vzpFgFcAm5p8snpN9xVnrLsXnkZkYjg1ZUpcWeek_NcdaaehiMS_fkxiKWhWnMxWyXr9Rc1mVTEYCnSmekcuV0YdRrIsp6JBPejU_HguOeJCatPNsWG83j0RV6RkC8DNGNm8sUvpECi9es_SuzQgCoKtwLEKgRuKst9tRnZfi1gjuhLAAngqqjuCbXJxM_ht43plMeClsOg53f9IS_oH1k8sIkeg1Bk6t224-ezB8-oNWWAhqkPVvXykY1_obG6e9BEC6L67i_A1JbXKUviYRuCA'
            }
        };

        const expected: AccessTokenData = {
            aud: 'api://default',
            branchid: 'cfaa7bf4-bff8-4c8c-b71e-f64bd8249750',
            cid: '0oagr58c4ncsC9gr70h7',
            exp: 1548243871,
            iat: 1548240271,
            iss: 'https://dev-396180.oktapreview.com/oauth2/default',
            jti: 'AT.IPJq5xHkw_54ZpSwrkts91CbgOm1qInXusVohAEJlAA',
            scopelevel: 'branch',
            scp: ['email', 'openid', 'profile'],
            sub: 'dean.vanniekerk@kurtosys.com',
            uid: '00uifpb4qjzscYoOx0h7',
            ver: 1
        };

        //@ts-ignore
        const actual = accessTokenDataSelector(state);

        expect(actual).toEqual(expected);
    });

    it('idTokenDataSelector', () => {
        const state = {
            auth: {
                idToken:
                    'eyJraWQiOiI4N0lMLXZMdUoybXlaYkxjeWZzWDV2MDZaOXhWNWt4ajJzeF9FUG43QU1NIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwMHVpZnBiNHFqenNjWW9PeDBoNyIsIm5hbWUiOiJSZWFkb25seSB2YW4gTmlla2VyayIsImVtYWlsIjoiZGVhbi52YW5uaWVrZXJrQGt1cnRvc3lzLmNvbSIsInZlciI6MSwiaXNzIjoiaHR0cHM6Ly9kZXYtMzk2MTgwLm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6IjBvYWdyNThjNG5jc0M5Z3I3MGg3IiwiaWF0IjoxNTQ4MjQwMjcxLCJleHAiOjE1NDgyNDM4NzEsImp0aSI6IklELjhJZXQwVmoxVmxkNWJpT1NnLTlXZzV5M1U3N2JFeEdWVFkzYlpmSVYxR3MiLCJhbXIiOlsicHdkIl0sImlkcCI6IjAwb2czY3Ftd3RYbG1ieTNyMGg3Iiwibm9uY2UiOiI5WENyQ2c5ZFlmdml4MkJGNmxEOUxjajkwa0k3NzJoWWZhclFlT01XWFNOeDZ4SFNvQzJ5MFVNSzR0UmNiRjJBIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZGVhbi52YW5uaWVrZXJrQGt1cnRvc3lzLmNvbSIsImF1dGhfdGltZSI6MTU0ODI0MDI3MCwiYXRfaGFzaCI6Ii1BcVh6VUVrcVNuU3pxUl9SdF9NVEEiLCJicmFuY2hpZCI6ImNmYWE3YmY0LWJmZjgtNGM4Yy1iNzFlLWY2NGJkODI0OTc1MCIsInJvbGVzIjpbIkV2ZXJ5b25lIiwibWVtX2Jyb2tlciIsIm1lbV9hZG1pbmlzdHJhdG9yIiwiY29tX3JlYWRvbmx5Il0sIm9yZ2FuaXNhdGlvbiI6IjVlMmEwODMzLTE3NDQtNDAwNi05YjBmLTA4ZDY2NTA5NjViYyIsInNjb3BlbGV2ZWwiOiJicmFuY2gifQ.XCEyT5c8gbGSMTNKwZ7BIIPitDJfwDJw-eHW8I1ftn_KiT0xMlBk_hq2YZIhczTaU2ubjbUZdiGVvBbJun2hwdjZrW_XVLoWRk0OyOIAbZMikrFzOV11CvMUob2bvIpWNjHibuPCoCPreqqsDpAEsyDx6H6jAzsn36GnMmD14dPnPiM50r-2tAJUJx2BI8LhVvxQN4kXFShhjbOxdSbDtronmMcVPYsTHT6LZ8j02o-KoHGTtH4-t8gDL1iYLtkc1cbpFqdxtsVOPYNMni74eTxptydo1KBxWQwRKXzPc6WusnFHVHFOmAy-P92jJQdst-NXf4_Folbv_C-wLjZ4FA'
            }
        };

        const expected: IdTokenData = {
            amr: ['pwd'],
            at_hash: '-AqXzUEkqSnSzqR_Rt_MTA',
            aud: '0oagr58c4ncsC9gr70h7',
            auth_time: 1548240270,
            branchid: 'cfaa7bf4-bff8-4c8c-b71e-f64bd8249750',
            email: 'dean.vanniekerk@kurtosys.com',
            exp: 1548243871,
            iat: 1548240271,
            idp: '00og3cqmwtXlmby3r0h7',
            iss: 'https://dev-396180.oktapreview.com/oauth2/default',
            jti: 'ID.8Iet0Vj1Vld5biOSg-9Wg5y3U77bExGVTY3bZfIV1Gs',
            name: 'Readonly van Niekerk',
            nonce:
                '9XCrCg9dYfvix2BF6lD9Lcj90kI772hYfarQeOMWXSNx6xHSoC2y0UMK4tRcbF2A',
            organisation: '5e2a0833-1744-4006-9b0f-08d6650965bc',
            preferred_username: 'dean.vanniekerk@kurtosys.com',
            roles: [
                'Everyone',
                'mem_broker',
                'mem_administrator',
                'com_readonly'
            ],
            scopelevel: 'branch',
            sub: '00uifpb4qjzscYoOx0h7',
            ver: 1
        };

        //@ts-ignore
        const actual = idTokenDataSelector(state);

        expect(actual).toEqual(expected);
    });
});
