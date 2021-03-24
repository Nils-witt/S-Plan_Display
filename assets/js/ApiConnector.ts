/*
 * MIT License
 *
 * Copyright (c) 2020. Nils Witt
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

class ApiConnector {

    public static loadData(): Promise<DisplayDataSet> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await fetch(Global.apiUrl + "/display/id/" + Global.displayId + '/data', {
                    method: 'GET',
                    headers: {
                        "Authorization": "Bearer " + Global.apiToken
                    }
                });
                if (res.status === 200) {
                    let data = await res.json();
                    resolve(data);
                } else {
                    reject(2);
                    console.log("auth error")
                }
            } catch (e) {
                console.log(e);
                reject(1);
            }
        });
    }

    public static loadConfig() {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await fetch(Global.apiUrl + "/display/id/" + Global.displayId + '/config', {
                    method: 'GET',
                    headers: {
                        "Authorization": "Bearer " + Global.apiToken
                    }
                });
                if (res.status === 200) {
                    let data = await res.json();
                    resolve(data);
                } else {
                    reject(2);
                    console.log("auth error")
                }
            } catch (e) {
                console.log(e);
                reject(1);
            }
        });
    }
}
