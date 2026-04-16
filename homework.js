// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require('dotenv').config({path: '.env'})

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH
const BASE_URL = 'https://livejs-api.hexschool.io'
const ADMIN_TOKEN = process.env.API_KEY

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
  // 提示：
  // 1. 使用 fetch() 發送 GET 請求
  // 2. 使用 response.json() 解析回應
  // 3. 回傳 data.products
  const response = await fetch(
    `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`,
  )
  const data = await response.json()
  return data.products
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
  const response = await fetch(
    `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,
  )
  const data = await response.json()
  return {
    carts: data.carts,
    total: data.total,
    finalTotal: data.finalTotal,
  }
}

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
  // 提示：
  // 1. 加上 try-catch 處理錯誤
  // 2. 檢查 response.ok 判斷是否成功
  // 3. 成功回傳 { success: true, data: [...] }
  // 4. 失敗回傳 { success: false, error: '錯誤訊息' }
  try {
    const response = await fetch(
      `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`,
    )
    const data = await response.json()

    // 檢查 HTTP 狀態碼
    if (!response.ok) {
      // 表示狀態碼不是 2xx
      return {
        success: false,
        error: data.message || '取得產品失敗',
      }
    }
    return {
      success: true,
      data: data.products,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function addToCart(productId, quantity) {
  // 提示：
  // 1. 發送 POST 請求
  // 2. body 格式：{ data: { productId: "xxx", quantity: 1 } }
  // 3. 記得設定 headers: { 'Content-Type': 'application/json' }
  // 4. body 要用 JSON.stringify() 轉換
  const response = await fetch(
    `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          productId,
          quantity,
        },
      }),
    },
  )
  const data = await response.json()
  return data
}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
  // 提示：
  // 1. 發送 PATCH 請求
  // 2. body 格式：{ data: { id: "購物車ID", quantity: 數量 } }
  const response = await fetch(
    `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          id: cartId,
          quantity,
        },
      }),
    },
  )
  const data = await response.json()
  return data
}

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
  // 提示：發送 DELETE 請求到 /carts/{id}
  const response = await fetch(
    `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`,
    {
      method: 'DELETE',
    },
  )
  const data = await response.json()
  return data
}

/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
  // 提示：發送 DELETE 請求到 /carts
  const response = await fetch(
    `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,
    {
      method: 'DELETE',
    },
  )
  const data = await response.json()
  return data
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：伺服器回應的類型分類
  - 1xx：資訊回應 (Informational):請求已被伺服器接收，正在處理中。
      常見代碼：
      101 Switching Protocols：伺服器同意切換協議（例如從 HTTP 切換到 WebSocket）。
  - 2xx：成功回應 (Successful):請求已成功被伺服器接收、理解、並接受。
      常見代碼：
      200 OK：請求成功（最常見）。
      201 Created：請求成功且伺服器建立了新的資源（常用於 POST 請求）。
      204 No Content：請求成功，但伺服器沒有回傳任何內容（常用於 DELETE 請求）。
  - 3xx:重新導向 (Redirection):客戶端需要進行額外的動作才能完成請求。
      常見代碼：
      301 Moved Permanently：資源已永久移到新位置。
      302 Found：資源暫時移動（暫時跳轉）。
      304 Not Modified：自上次請求以來資源未更改，請直接使用瀏覽器的暫存（快取），這能節省流量。
  - 4xx:用戶端錯誤 (Client Error):請求有語法錯誤或無法完成。
      常見代碼：
      400 Bad Request：請求格式錯誤，伺服器看不懂。
      401 Unauthorized：未認證，需要登入。
      403 Forbidden：伺服器拒絕執行（你有登入，但你沒權限看這頁）。
      404 Not Found：找不到資源（網址打錯或頁面已刪除）。
  - 5xx:伺服器錯誤 (Server Error):伺服器在處理請求時發生錯誤。
      常見代碼：
      500 Internal Server Error：伺服器內部錯誤（最籠統的報錯）。
      502 Bad Gateway：伺服器作為閘道器時，從上游伺服器收到無效回應。
      503 Service Unavailable：伺服器目前超載或正在維護。
      504 Gateway Timeout：伺服器處理太久，導致連線逾時。

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：
   GET：讀取資料
   POST：建立資料
   PATCH：部分更新資料
   PUT：完整更新資料(替換整筆資料)
   DELETE：刪除資料


3. 什麼是 RESTful API？
   答：RESTful API 是一種設計 API 的「風格」或「約定」，它利用 HTTP 方法（GET、POST、PUT、PATCH、DELETE）來操作資源，並遵循無狀態、統一接口、可擴展性等原則。

*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
  API_PATH,
  BASE_URL,
  ADMIN_TOKEN,
  getProducts,
  getCart,
  getProductsSafe,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
}

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
  async function runTests() {
    console.log('=== 第六週作業測試 ===\n')
    console.log('API_PATH:', API_PATH)
    console.log('')

    if (!API_PATH) {
      console.log('請先在 .env 檔案中設定 API_PATH！')
      return
    }

    // 任務一測試
    console.log('--- 任務一：基礎 fetch ---')
    try {
      const products = await getProducts()
      console.log(
        'getProducts:',
        products ? `成功取得 ${products.length} 筆產品` : '回傳 undefined',
      )
    } catch (error) {
      console.log('getProducts 錯誤:', error.message)
    }

    try {
      const cart = await getCart()
      console.log(
        'getCart:',
        cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : '回傳 undefined',
      )
    } catch (error) {
      console.log('getCart 錯誤:', error.message)
    }

    try {
      const result = await getProductsSafe()
      console.log(
        'getProductsSafe:',
        result?.success ? '成功' : result?.error || '回傳 undefined',
      )
    } catch (error) {
      console.log('getProductsSafe 錯誤:', error.message)
    }

    console.log('\n=== 測試結束 ===')
    console.log('\n提示：執行 node test.js 進行完整驗證')
  }

  runTests()
}
