---
title: Applyons Backoffice API v1.0.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="applyons-backoffice-api">Applyons Backoffice API v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

API Documentation for Applyons Backoffice

Base URLs:

* <a href="http://localhost:5000">http://localhost:5000</a>

* <a href="https://api-applyons.applyons.com">https://api-applyons.applyons.com</a>

Email: <a href="mailto:support@applyons.com">Applyons Support</a> 

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="applyons-backoffice-api-abonnements">Abonnements</h1>

Gestion des abonnements

## get__abonnements

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/abonnements \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/abonnements HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/abonnements',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/abonnements', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/abonnements', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/abonnements", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /abonnements`

*Liste des abonnements*

<h3 id="get__abonnements-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__abonnements

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/abonnements \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/abonnements HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/abonnements',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/abonnements', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/abonnements', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/abonnements", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /abonnements`

*Crée un nouvel abonnement*

<h3 id="post__abonnements-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__abonnements_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/abonnements/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/abonnements/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/abonnements/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/abonnements/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/abonnements/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/abonnements/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /abonnements/{id}`

*Récupère un abonnement par ID*

<h3 id="get__abonnements_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__abonnements_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:5000/abonnements/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:5000/abonnements/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements/{id}',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:5000/abonnements/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:5000/abonnements/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:5000/abonnements/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:5000/abonnements/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /abonnements/{id}`

*Met à jour un abonnement*

<h3 id="put__abonnements_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__abonnements_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/abonnements/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/abonnements/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/abonnements/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/abonnements/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/abonnements/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/abonnements/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /abonnements/{id}`

*Archive un abonnement*

<h3 id="delete__abonnements_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__abonnements_{id}_restore

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/abonnements/{id}/restore \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/abonnements/{id}/restore HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements/{id}/restore',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/abonnements/{id}/restore',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/abonnements/{id}/restore', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/abonnements/{id}/restore', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements/{id}/restore");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/abonnements/{id}/restore", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /abonnements/{id}/restore`

*Restaure un abonnement archivé*

<h3 id="patch__abonnements_{id}_restore-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__abonnements_{id}_hard-delete

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/abonnements/{id}/hard-delete \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/abonnements/{id}/hard-delete HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements/{id}/hard-delete',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/abonnements/{id}/hard-delete',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/abonnements/{id}/hard-delete', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/abonnements/{id}/hard-delete', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements/{id}/hard-delete");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/abonnements/{id}/hard-delete", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /abonnements/{id}/hard-delete`

*Supprime définitivement un abonnement*

<h3 id="delete__abonnements_{id}_hard-delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__abonnements_{id}_renew

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/abonnements/{id}/renew \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/abonnements/{id}/renew HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements/{id}/renew',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/abonnements/{id}/renew',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/abonnements/{id}/renew', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/abonnements/{id}/renew', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements/{id}/renew");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/abonnements/{id}/renew", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /abonnements/{id}/renew`

*Renouvelle un abonnement*

<h3 id="post__abonnements_{id}_renew-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__abonnements_organizations_{orgId}_active

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/abonnements/organizations/{orgId}/active \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/abonnements/organizations/{orgId}/active HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements/organizations/{orgId}/active',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/abonnements/organizations/{orgId}/active',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/abonnements/organizations/{orgId}/active', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/abonnements/organizations/{orgId}/active', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements/organizations/{orgId}/active");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/abonnements/organizations/{orgId}/active", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /abonnements/organizations/{orgId}/active`

*Récupère l'abonnement actif pour une organisation*

<h3 id="get__abonnements_organizations_{orgid}_active-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__abonnements_expiring-soon

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/abonnements/expiring-soon \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/abonnements/expiring-soon HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements/expiring-soon',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/abonnements/expiring-soon',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/abonnements/expiring-soon', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/abonnements/expiring-soon', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements/expiring-soon");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/abonnements/expiring-soon", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /abonnements/expiring-soon`

*Liste des abonnements expirant bientôt*

<h3 id="get__abonnements_expiring-soon-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__abonnements_stats

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/abonnements/stats \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/abonnements/stats HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/abonnements/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/abonnements/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/abonnements/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/abonnements/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/abonnements/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/abonnements/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /abonnements/stats`

*Statistiques des abonnements*

<h3 id="get__abonnements_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-auth">Auth</h1>

Authentification et gestion des utilisateurs

## post__auth_register

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/register \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/register HTTP/1.1
Host: localhost:5000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "role": "DEMANDEUR",
  "organizationId": "string",
  "permissions": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/register',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/register', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/register', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/register");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/register", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/register`

*Inscription d'un nouvel utilisateur*

> Body parameter

```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "role": "DEMANDEUR",
  "organizationId": "string",
  "permissions": [
    "string"
  ]
}
```

<h3 id="post__auth_register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[RegisterUser](#schemaregisteruser)|true|none|

<h3 id="post__auth_register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Inscription réussie|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Erreurs de validation ou email déjà utilisé|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_login

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/login \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/login HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/login',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/login',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/login', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/login', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/login");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/login", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/login`

*Connexion d'un utilisateur*

<h3 id="post__auth_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_logout

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/logout \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/logout HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/logout',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/logout',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/logout', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/logout', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/logout");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/logout", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/logout`

*Déconnexion de l'utilisateur*

<h3 id="post__auth_logout-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__auth_profile

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/auth/profile \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/auth/profile HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/profile',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/auth/profile',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/auth/profile', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/auth/profile', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/profile");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/auth/profile", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /auth/profile`

*Récupère le profil de l'utilisateur connecté*

<h3 id="get__auth_profile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__auth_profile

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:5000/auth/profile \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:5000/auth/profile HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/profile',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:5000/auth/profile',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:5000/auth/profile', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:5000/auth/profile', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/profile");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:5000/auth/profile", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /auth/profile`

*Met à jour le profil de l'utilisateur connecté*

<h3 id="put__auth_profile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_change-password

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/change-password \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/change-password HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/change-password',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/change-password',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/change-password', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/change-password', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/change-password");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/change-password", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/change-password`

*Change le mot de passe de l'utilisateur connecté*

<h3 id="post__auth_change-password-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_forgot-password

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/forgot-password \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/forgot-password HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/forgot-password',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/forgot-password',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/forgot-password', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/forgot-password', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/forgot-password");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/forgot-password", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/forgot-password`

*Demande de réinitialisation de mot de passe*

<h3 id="post__auth_forgot-password-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_reset-password

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/reset-password \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/reset-password HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/reset-password',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/reset-password',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/reset-password', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/reset-password', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/reset-password");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/reset-password", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/reset-password`

*Réinitialise le mot de passe avec un token*

<h3 id="post__auth_reset-password-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_resend-activation

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/resend-activation \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/resend-activation HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/resend-activation',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/resend-activation',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/resend-activation', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/resend-activation', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/resend-activation");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/resend-activation", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/resend-activation`

*Renvoie un lien d'activation*

<h3 id="post__auth_resend-activation-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_verify-account

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/verify-account \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/verify-account HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/verify-account',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/verify-account',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/verify-account', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/verify-account', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/verify-account");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/verify-account", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/verify-account`

*Vérifie le compte avec un token d'activation*

<h3 id="post__auth_verify-account-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_refresh-token

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/refresh-token \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/refresh-token HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/refresh-token',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/refresh-token',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/refresh-token', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/refresh-token', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/refresh-token");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/refresh-token", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/refresh-token`

*Rafraîchit le token d'authentification*

<h3 id="post__auth_refresh-token-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_admin_set-enabled

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/admin/set-enabled \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/admin/set-enabled HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/admin/set-enabled',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/admin/set-enabled',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/admin/set-enabled', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/admin/set-enabled', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/admin/set-enabled");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/admin/set-enabled", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/admin/set-enabled`

*Active/Désactive un utilisateur (admin)*

<h3 id="post__auth_admin_set-enabled-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_logout-all

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/logout-all \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/logout-all HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/logout-all',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/logout-all',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/logout-all', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/logout-all', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/logout-all");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/logout-all", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/logout-all`

*Déconnecte toutes les sessions de l'utilisateur*

<h3 id="post__auth_logout-all-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__auth_admin_impersonate

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/auth/admin/impersonate \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/auth/admin/impersonate HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/auth/admin/impersonate',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/auth/admin/impersonate',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/auth/admin/impersonate', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/auth/admin/impersonate', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/auth/admin/impersonate");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/auth/admin/impersonate", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/admin/impersonate`

*Permet à un admin d'emprunter l'identité d'un autre utilisateur*

<h3 id="post__auth_admin_impersonate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-configurations">Configurations</h1>

Gestion des configurations applicatives (clé/valeur)

## post__configurations

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/configurations \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/configurations HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "key": "smtp.host",
  "value": "string",
  "jsonValue": {},
  "description": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/configurations',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/configurations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/configurations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/configurations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/configurations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/configurations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /configurations`

*Crée ou met à jour une configuration (upsert)*

> Body parameter

```json
{
  "key": "smtp.host",
  "value": "string",
  "jsonValue": {},
  "description": "string"
}
```

<h3 id="post__configurations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[UpsertConfiguration](#schemaupsertconfiguration)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Configuration enregistrée",
  "item": {
    "id": "string",
    "key": "string",
    "value": "string",
    "jsonValue": {},
    "description": "string",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="post__configurations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Configuration mise à jour|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Configuration créée|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Erreurs de validation|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="post__configurations-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» item|[Configuration](#schemaconfiguration)|false|none|none|
|»» id|string|false|none|none|
|»» key|string|false|none|none|
|»» value|string¦null|false|none|none|
|»» jsonValue|object¦null|false|none|none|
|»» description|string¦null|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» item|[Configuration](#schemaconfiguration)|false|none|none|
|»» id|string|false|none|none|
|»» key|string|false|none|none|
|»» value|string¦null|false|none|none|
|»» jsonValue|object¦null|false|none|none|
|»» description|string¦null|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-contactmessages">ContactMessages</h1>

Gestion des messages de contact

## get__contact-messages_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/contact-messages/{id} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/contact-messages/{id} HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/contact-messages/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/contact-messages/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/contact-messages/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/contact-messages/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/contact-messages/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/contact-messages/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /contact-messages/{id}`

*Récupère un message de contact par ID*

<h3 id="get__contact-messages_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|ID du message|

> Example responses

> 200 Response

```json
{
  "message": {
    "id": "string",
    "name": "string",
    "email": "user@example.com",
    "subject": "string",
    "message": "string",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get__contact-messages_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Détails du message|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Message introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__contact-messages_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|[ContactMessage](#schemacontactmessage)|false|none|none|
|»» id|string|false|none|none|
|»» name|string|false|none|none|
|»» email|string(email)|false|none|none|
|»» subject|string¦null|false|none|none|
|»» message|string|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__contact-messages_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/contact-messages/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/contact-messages/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/contact-messages/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/contact-messages/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/contact-messages/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/contact-messages/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/contact-messages/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/contact-messages/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /contact-messages/{id}`

*Supprime définitivement un message*

<h3 id="delete__contact-messages_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|ID du message|

<h3 id="delete__contact-messages_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message supprimé|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Message introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__contact-messages

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/contact-messages \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/contact-messages HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = 'false';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/contact-messages',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/contact-messages',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/contact-messages', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/contact-messages', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/contact-messages");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/contact-messages", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /contact-messages`

*Crée un message de contact (public)*

> Body parameter

```json
false
```

> Example responses

> 201 Response

```json
{
  "message": "Message enregistré",
  "item": {
    "id": "string",
    "name": "string",
    "email": "user@example.com",
    "subject": "string",
    "message": "string",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="post__contact-messages-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Message enregistré|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Erreurs de validation|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="post__contact-messages-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» item|[ContactMessage](#schemacontactmessage)|false|none|none|
|»» id|string|false|none|none|
|»» name|string|false|none|none|
|»» email|string(email)|false|none|none|
|»» subject|string¦null|false|none|none|
|»» message|string|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__contact-messages

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/contact-messages \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/contact-messages HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/contact-messages',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/contact-messages',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/contact-messages', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/contact-messages', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/contact-messages");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/contact-messages", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /contact-messages`

*Purge les messages plus anciens que X jours*

<h3 id="delete__contact-messages-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|days|query|integer|false|Supprime les messages créés il y a plus de N jours|

> Example responses

> 200 Response

```json
{
  "deleted": 0
}
```

<h3 id="delete__contact-messages-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Purge effectuée|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="delete__contact-messages-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» deleted|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__contact-messages_export_csv

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/contact-messages/export/csv \
  -H 'Accept: text/csv' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/contact-messages/export/csv HTTP/1.1
Host: localhost:5000
Accept: text/csv

```

```javascript

const headers = {
  'Accept':'text/csv',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/contact-messages/export/csv',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'text/csv',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/contact-messages/export/csv',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'text/csv',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/contact-messages/export/csv', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'text/csv',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/contact-messages/export/csv', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/contact-messages/export/csv");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"text/csv"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/contact-messages/export/csv", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /contact-messages/export/csv`

*Exporte les messages de contact en CSV*

<h3 id="get__contact-messages_export_csv-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer|false|Numéro de page (1-n)|
|limit|query|integer|false|Taille de page|
|sortBy|query|string|false|none|
|sortOrder|query|string|false|none|
|email|query|string|false|none|
|search|query|string|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sortOrder|asc|
|sortOrder|desc|

> Example responses

> 200 Response

<h3 id="get__contact-messages_export_csv-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Fichier CSV|string|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__contact-messages_stats

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/contact-messages/stats \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/contact-messages/stats HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/contact-messages/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/contact-messages/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/contact-messages/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/contact-messages/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/contact-messages/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/contact-messages/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /contact-messages/stats`

*Statistiques des messages de contact*

> Example responses

> 200 Response

```json
{
  "total": 0,
  "byMonth": [
    {
      "month": "string",
      "count": 0
    }
  ],
  "byEmailDomain": [
    {
      "domain": "string",
      "count": 0
    }
  ]
}
```

<h3 id="get__contact-messages_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Statistiques|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__contact-messages_stats-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» total|integer|false|none|none|
|» byMonth|[object]|false|none|none|
|»» month|string|false|none|none|
|»» count|integer|false|none|none|
|» byEmailDomain|[object]|false|none|none|
|»» domain|string|false|none|none|
|»» count|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-dashboard">Dashboard</h1>

Endpoints liés au tableau de bord et à la supervision

## get__dashboard_stats

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/dashboard/stats \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/dashboard/stats HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/dashboard/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/dashboard/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/dashboard/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/dashboard/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/dashboard/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/dashboard/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /dashboard/stats`

*Récupérer les statistiques globales du dashboard*

<h3 id="get__dashboard_stats-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|recentDays|query|integer|false|Fenêtre en jours pour calculer des métriques "récentes"|

<h3 id="get__dashboard_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Données de stats|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__dashboard_recent-activities

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/dashboard/recent-activities \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/dashboard/recent-activities HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/dashboard/recent-activities',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/dashboard/recent-activities',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/dashboard/recent-activities', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/dashboard/recent-activities', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/dashboard/recent-activities");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/dashboard/recent-activities", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /dashboard/recent-activities`

*Liste des activités récentes*

<h3 id="get__dashboard_recent-activities-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Nombre maximum d'éléments|

<h3 id="get__dashboard_recent-activities-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Liste des activités|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__dashboard_system-notifications

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/dashboard/system-notifications \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/dashboard/system-notifications HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/dashboard/system-notifications',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/dashboard/system-notifications',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/dashboard/system-notifications', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/dashboard/system-notifications', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/dashboard/system-notifications");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/dashboard/system-notifications", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /dashboard/system-notifications`

*Notifications système (événements critiques)*

<h3 id="get__dashboard_system-notifications-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|none|
|type|query|string|false|Type de notification (optionnel)|

<h3 id="get__dashboard_system-notifications-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notifications|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__dashboard_audit-logs

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/dashboard/audit-logs \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/dashboard/audit-logs HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/dashboard/audit-logs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/dashboard/audit-logs',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/dashboard/audit-logs', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/dashboard/audit-logs', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/dashboard/audit-logs");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/dashboard/audit-logs", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /dashboard/audit-logs`

*Liste paginée des logs d'audit*

<h3 id="get__dashboard_audit-logs-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer|false|none|
|limit|query|integer|false|none|
|sortBy|query|string|false|none|
|sortOrder|query|string|false|none|
|action|query|string|false|none|
|resource|query|string|false|none|
|userId|query|string|false|none|
|startDate|query|string(date-time)|false|none|
|endDate|query|string(date-time)|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sortBy|createdAt|
|sortBy|action|
|sortBy|resource|
|sortBy|userId|
|sortOrder|asc|
|sortOrder|desc|

<h3 id="get__dashboard_audit-logs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Logs d'audit paginés|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__dashboard_audit-logs_export_csv

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/dashboard/audit-logs/export/csv \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/dashboard/audit-logs/export/csv HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/dashboard/audit-logs/export/csv',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/dashboard/audit-logs/export/csv',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/dashboard/audit-logs/export/csv', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/dashboard/audit-logs/export/csv', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/dashboard/audit-logs/export/csv");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/dashboard/audit-logs/export/csv", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /dashboard/audit-logs/export/csv`

*Exporter les logs d'audit en CSV (avec filtres)*

<h3 id="get__dashboard_audit-logs_export_csv-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|action|query|string|false|none|
|resource|query|string|false|none|
|userId|query|string|false|none|
|startDate|query|string(date-time)|false|none|
|endDate|query|string(date-time)|false|none|

<h3 id="get__dashboard_audit-logs_export_csv-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Fichier CSV|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-demandes">Demandes</h1>

Gestion des demandes de partage

## get__demandes

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/demandes \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/demandes HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/demandes',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/demandes', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/demandes', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/demandes", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /demandes`

*Liste des demandes de partage*

Retourne une liste paginée et filtrable des demandes.

<h3 id="get__demandes-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer|false|Numéro de page (1-n)|
|limit|query|integer|false|Taille de page|
|sortBy|query|string|false|Champ de tri (selon ressource)|
|sortOrder|query|string|false|Ordre de tri|
|search|query|string|false|Code, année, niveau, email utilisateur, nom d'organisation|
|userId|query|string|false|none|
|targetOrgId|query|string|false|none|
|assignedOrgId|query|string|false|none|
|from|query|string(date)|false|none|
|to|query|string(date)|false|none|
|status|query|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sortOrder|asc|
|sortOrder|desc|

> Example responses

> 200 Response

```json
{
  "demandes": [
    {
      "id": "string",
      "code": "string",
      "dateDemande": "2019-08-24T14:15:22Z",
      "isDeleted": true,
      "status": "string",
      "user": {
        "id": "string",
        "email": "user@example.com",
        "username": "string"
      },
      "targetOrg": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "type": "string"
      },
      "assignedOrg": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "type": "string"
      },
      "meta": {
        "serie": "string",
        "niveau": "string",
        "mention": "string",
        "annee": "string",
        "countryOfSchool": "string",
        "secondarySchoolName": "string",
        "graduationDate": "2019-08-24T14:15:22Z"
      },
      "documentsCount": 0,
      "transaction": {
        "id": "string",
        "demandePartageId": "string",
        "montant": 0,
        "typePaiement": "MOBILE_MONEY",
        "statut": "PENDING",
        "createdAt": "2019-08-24T14:15:22Z",
        "updatedAt": "2019-08-24T14:15:22Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 123,
    "pages": 13
  },
  "filters": {}
}
```

<h3 id="get__demandes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Liste paginée des demandes|[DemandeListResponse](#schemademandelistresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__demandes

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/demandes \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/demandes HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "targetOrgId": "string",
  "assignedOrgId": "string",
  "userId": "string",
  "serie": "string",
  "niveau": "string",
  "mention": "string",
  "annee": "string",
  "countryOfSchool": "string",
  "secondarySchoolName": "string",
  "graduationDate": "2019-08-24",
  "periode": "string",
  "year": "string",
  "status": "string",
  "observation": "string",
  "statusPayment": "string",
  "dob": "2019-08-24",
  "citizenship": "string",
  "passport": "string",
  "isEnglishFirstLanguage": true,
  "englishProficiencyTests": {},
  "testScores": "string",
  "gradingScale": "string",
  "gpa": "string",
  "examsTaken": {},
  "intendedMajor": "string",
  "extracurricularActivities": "string",
  "honorsOrAwards": "string",
  "parentGuardianName": "string",
  "occupation": "string",
  "educationLevel": "string",
  "willApplyForFinancialAid": true,
  "hasExternalSponsorship": true,
  "visaType": "string",
  "hasPreviouslyStudiedInUS": true,
  "personalStatement": "string",
  "optionalEssay": "string",
  "applicationRound": "string",
  "howDidYouHearAboutUs": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/demandes',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/demandes', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/demandes', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/demandes", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /demandes`

*Crée une nouvelle demande de partage*

> Body parameter

```json
{
  "targetOrgId": "string",
  "assignedOrgId": "string",
  "userId": "string",
  "serie": "string",
  "niveau": "string",
  "mention": "string",
  "annee": "string",
  "countryOfSchool": "string",
  "secondarySchoolName": "string",
  "graduationDate": "2019-08-24",
  "periode": "string",
  "year": "string",
  "status": "string",
  "observation": "string",
  "statusPayment": "string",
  "dob": "2019-08-24",
  "citizenship": "string",
  "passport": "string",
  "isEnglishFirstLanguage": true,
  "englishProficiencyTests": {},
  "testScores": "string",
  "gradingScale": "string",
  "gpa": "string",
  "examsTaken": {},
  "intendedMajor": "string",
  "extracurricularActivities": "string",
  "honorsOrAwards": "string",
  "parentGuardianName": "string",
  "occupation": "string",
  "educationLevel": "string",
  "willApplyForFinancialAid": true,
  "hasExternalSponsorship": true,
  "visaType": "string",
  "hasPreviouslyStudiedInUS": true,
  "personalStatement": "string",
  "optionalEssay": "string",
  "applicationRound": "string",
  "howDidYouHearAboutUs": "string"
}
```

<h3 id="post__demandes-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateDemande](#schemacreatedemande)|true|none|

> Example responses

> 201 Response

```json
{
  "message": "Demande créée",
  "demande": {
    "id": "string",
    "code": "string",
    "dateDemande": "2019-08-24T14:15:22Z",
    "isDeleted": true,
    "status": "string",
    "user": {
      "id": "string",
      "email": "user@example.com",
      "username": "string"
    },
    "targetOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "assignedOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "meta": {
      "serie": "string",
      "niveau": "string",
      "mention": "string",
      "annee": "string",
      "countryOfSchool": "string",
      "secondarySchoolName": "string",
      "graduationDate": "2019-08-24T14:15:22Z"
    },
    "documentsCount": 0,
    "transaction": {
      "id": "string",
      "demandePartageId": "string",
      "montant": 0,
      "typePaiement": "MOBILE_MONEY",
      "statut": "PENDING",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

<h3 id="post__demandes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Demande créée|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Erreur de validation|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="post__demandes-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» demande|[Demande](#schemademande)|false|none|none|
|»» id|string|false|none|none|
|»» code|string¦null|false|none|none|
|»» dateDemande|string(date-time)|false|none|none|
|»» isDeleted|boolean|false|none|none|
|»» status|string¦null|false|none|none|
|»» user|[UserLite](#schemauserlite)|false|none|none|
|»»» id|string|false|none|none|
|»»» email|string(email)|false|none|none|
|»»» username|string|false|none|none|
|»» targetOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|»»» id|string|false|none|none|
|»»» name|string|false|none|none|
|»»» slug|string|false|none|none|
|»»» type|string¦null|false|none|none|
|»» assignedOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|»» meta|object|false|none|none|
|»»» serie|string¦null|false|none|none|
|»»» niveau|string¦null|false|none|none|
|»»» mention|string¦null|false|none|none|
|»»» annee|string¦null|false|none|none|
|»»» countryOfSchool|string¦null|false|none|none|
|»»» secondarySchoolName|string¦null|false|none|none|
|»»» graduationDate|string(date-time)¦null|false|none|none|
|»» documentsCount|integer|false|none|none|
|»» transaction|[Transaction](#schematransaction)|false|none|none|
|»»» id|string|false|none|none|
|»»» demandePartageId|string|false|none|none|
|»»» montant|number|false|none|none|
|»»» typePaiement|string|false|none|none|
|»»» statut|string|false|none|none|
|»»» createdAt|string(date-time)¦null|false|none|none|
|»»» updatedAt|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|typePaiement|MOBILE_MONEY|
|typePaiement|BANK_TRANSFER|
|typePaiement|CARD|
|typePaiement|CASH|
|statut|PENDING|
|statut|SUCCESS|
|statut|FAILED|
|statut|CANCELED|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__demandes_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/demandes/{id} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/demandes/{id} HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/demandes/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/demandes/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/demandes/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/demandes/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /demandes/{id}`

*Récupère une demande par ID*

<h3 id="get__demandes_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "demande": {
    "id": "string",
    "code": "string",
    "dateDemande": "2019-08-24T14:15:22Z",
    "isDeleted": true,
    "status": "string",
    "user": {
      "id": "string",
      "email": "user@example.com",
      "username": "string"
    },
    "targetOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "assignedOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "meta": {
      "serie": "string",
      "niveau": "string",
      "mention": "string",
      "annee": "string",
      "countryOfSchool": "string",
      "secondarySchoolName": "string",
      "graduationDate": "2019-08-24T14:15:22Z"
    },
    "documentsCount": 0,
    "transaction": {
      "id": "string",
      "demandePartageId": "string",
      "montant": 0,
      "typePaiement": "MOBILE_MONEY",
      "statut": "PENDING",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  },
  "documents": [
    {
      "id": "string",
      "demandePartageId": "string",
      "ownerOrgId": "string",
      "codeAdn": "string",
      "estTraduit": true,
      "aDocument": true,
      "hasOriginal": true,
      "hasTraduit": true,
      "isEncrypted": true,
      "urlOriginal": "http://example.com",
      "urlTraduit": "http://example.com",
      "urlChiffre": "http://example.com",
      "blockchainHash": "string",
      "encryptedBy": "string",
      "encryptedAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "transaction": {
    "id": "string",
    "demandePartageId": "string",
    "montant": 0,
    "typePaiement": "MOBILE_MONEY",
    "statut": "PENDING",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  },
  "payment": {
    "id": "string",
    "provider": "string",
    "status": "INITIATED",
    "amount": 0,
    "currency": "string",
    "paymentType": "MOBILE_MONEY",
    "providerRef": "string",
    "paymentInfo": {},
    "demandePartageId": "string",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get__demandes_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Détails de la demande|[DemandeItemResponse](#schemademandeitemresponse)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Demande introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__demandes_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:5000/demandes/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:5000/demandes/{id} HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "assignedOrgId": "string",
  "serie": "string",
  "niveau": "string",
  "mention": "string",
  "annee": "string",
  "countryOfSchool": "string",
  "secondarySchoolName": "string",
  "graduationDate": "2019-08-24",
  "periode": "string",
  "year": "string",
  "status": "string",
  "observation": "string",
  "statusPayment": "string",
  "dob": "2019-08-24",
  "citizenship": "string",
  "passport": "string",
  "isEnglishFirstLanguage": true,
  "englishProficiencyTests": {},
  "testScores": "string",
  "gradingScale": "string",
  "gpa": "string",
  "examsTaken": {},
  "intendedMajor": "string",
  "extracurricularActivities": "string",
  "honorsOrAwards": "string",
  "parentGuardianName": "string",
  "occupation": "string",
  "educationLevel": "string",
  "willApplyForFinancialAid": true,
  "hasExternalSponsorship": true,
  "visaType": "string",
  "hasPreviouslyStudiedInUS": true,
  "personalStatement": "string",
  "optionalEssay": "string",
  "applicationRound": "string",
  "howDidYouHearAboutUs": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:5000/demandes/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:5000/demandes/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:5000/demandes/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:5000/demandes/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /demandes/{id}`

*Met à jour une demande de partage*

> Body parameter

```json
{
  "assignedOrgId": "string",
  "serie": "string",
  "niveau": "string",
  "mention": "string",
  "annee": "string",
  "countryOfSchool": "string",
  "secondarySchoolName": "string",
  "graduationDate": "2019-08-24",
  "periode": "string",
  "year": "string",
  "status": "string",
  "observation": "string",
  "statusPayment": "string",
  "dob": "2019-08-24",
  "citizenship": "string",
  "passport": "string",
  "isEnglishFirstLanguage": true,
  "englishProficiencyTests": {},
  "testScores": "string",
  "gradingScale": "string",
  "gpa": "string",
  "examsTaken": {},
  "intendedMajor": "string",
  "extracurricularActivities": "string",
  "honorsOrAwards": "string",
  "parentGuardianName": "string",
  "occupation": "string",
  "educationLevel": "string",
  "willApplyForFinancialAid": true,
  "hasExternalSponsorship": true,
  "visaType": "string",
  "hasPreviouslyStudiedInUS": true,
  "personalStatement": "string",
  "optionalEssay": "string",
  "applicationRound": "string",
  "howDidYouHearAboutUs": "string"
}
```

<h3 id="put__demandes_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateDemande](#schemaupdatedemande)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Demande mise à jour",
  "demande": {
    "id": "string",
    "code": "string",
    "dateDemande": "2019-08-24T14:15:22Z",
    "isDeleted": true,
    "status": "string",
    "user": {
      "id": "string",
      "email": "user@example.com",
      "username": "string"
    },
    "targetOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "assignedOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "meta": {
      "serie": "string",
      "niveau": "string",
      "mention": "string",
      "annee": "string",
      "countryOfSchool": "string",
      "secondarySchoolName": "string",
      "graduationDate": "2019-08-24T14:15:22Z"
    },
    "documentsCount": 0,
    "transaction": {
      "id": "string",
      "demandePartageId": "string",
      "montant": 0,
      "typePaiement": "MOBILE_MONEY",
      "statut": "PENDING",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

<h3 id="put__demandes_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Demande mise à jour|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Erreur de validation|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Demande introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="put__demandes_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» demande|[Demande](#schemademande)|false|none|none|
|»» id|string|false|none|none|
|»» code|string¦null|false|none|none|
|»» dateDemande|string(date-time)|false|none|none|
|»» isDeleted|boolean|false|none|none|
|»» status|string¦null|false|none|none|
|»» user|[UserLite](#schemauserlite)|false|none|none|
|»»» id|string|false|none|none|
|»»» email|string(email)|false|none|none|
|»»» username|string|false|none|none|
|»» targetOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|»»» id|string|false|none|none|
|»»» name|string|false|none|none|
|»»» slug|string|false|none|none|
|»»» type|string¦null|false|none|none|
|»» assignedOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|»» meta|object|false|none|none|
|»»» serie|string¦null|false|none|none|
|»»» niveau|string¦null|false|none|none|
|»»» mention|string¦null|false|none|none|
|»»» annee|string¦null|false|none|none|
|»»» countryOfSchool|string¦null|false|none|none|
|»»» secondarySchoolName|string¦null|false|none|none|
|»»» graduationDate|string(date-time)¦null|false|none|none|
|»» documentsCount|integer|false|none|none|
|»» transaction|[Transaction](#schematransaction)|false|none|none|
|»»» id|string|false|none|none|
|»»» demandePartageId|string|false|none|none|
|»»» montant|number|false|none|none|
|»»» typePaiement|string|false|none|none|
|»»» statut|string|false|none|none|
|»»» createdAt|string(date-time)¦null|false|none|none|
|»»» updatedAt|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|typePaiement|MOBILE_MONEY|
|typePaiement|BANK_TRANSFER|
|typePaiement|CARD|
|typePaiement|CASH|
|statut|PENDING|
|statut|SUCCESS|
|statut|FAILED|
|statut|CANCELED|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__demandes_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/demandes/{id} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/demandes/{id} HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/demandes/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/demandes/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/demandes/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/demandes/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /demandes/{id}`

*Archive (soft delete) une demande*

<h3 id="delete__demandes_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Opération effectuée"
}
```

<h3 id="delete__demandes_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Demande archivée|[MessageOnly](#schemamessageonly)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__demandes_{id}_status

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/demandes/{id}/status \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/demandes/{id}/status HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "status": "VALIDATED"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}/status',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/demandes/{id}/status',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/demandes/{id}/status', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/demandes/{id}/status', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}/status");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/demandes/{id}/status", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /demandes/{id}/status`

*Met à jour le statut d'une demande*

> Body parameter

```json
{
  "status": "VALIDATED"
}
```

<h3 id="patch__demandes_{id}_status-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|true|none|
|» status|body|string|false|none|

> Example responses

> 200 Response

```json
{
  "message": "Statut mis à jour",
  "demande": {
    "id": "string",
    "code": "string",
    "dateDemande": "2019-08-24T14:15:22Z",
    "isDeleted": true,
    "status": "string",
    "user": {
      "id": "string",
      "email": "user@example.com",
      "username": "string"
    },
    "targetOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "assignedOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "meta": {
      "serie": "string",
      "niveau": "string",
      "mention": "string",
      "annee": "string",
      "countryOfSchool": "string",
      "secondarySchoolName": "string",
      "graduationDate": "2019-08-24T14:15:22Z"
    },
    "documentsCount": 0,
    "transaction": {
      "id": "string",
      "demandePartageId": "string",
      "montant": 0,
      "typePaiement": "MOBILE_MONEY",
      "statut": "PENDING",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

<h3 id="patch__demandes_{id}_status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Statut mis à jour|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Demande introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="patch__demandes_{id}_status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» demande|[Demande](#schemademande)|false|none|none|
|»» id|string|false|none|none|
|»» code|string¦null|false|none|none|
|»» dateDemande|string(date-time)|false|none|none|
|»» isDeleted|boolean|false|none|none|
|»» status|string¦null|false|none|none|
|»» user|[UserLite](#schemauserlite)|false|none|none|
|»»» id|string|false|none|none|
|»»» email|string(email)|false|none|none|
|»»» username|string|false|none|none|
|»» targetOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|»»» id|string|false|none|none|
|»»» name|string|false|none|none|
|»»» slug|string|false|none|none|
|»»» type|string¦null|false|none|none|
|»» assignedOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|»» meta|object|false|none|none|
|»»» serie|string¦null|false|none|none|
|»»» niveau|string¦null|false|none|none|
|»»» mention|string¦null|false|none|none|
|»»» annee|string¦null|false|none|none|
|»»» countryOfSchool|string¦null|false|none|none|
|»»» secondarySchoolName|string¦null|false|none|none|
|»»» graduationDate|string(date-time)¦null|false|none|none|
|»» documentsCount|integer|false|none|none|
|»» transaction|[Transaction](#schematransaction)|false|none|none|
|»»» id|string|false|none|none|
|»»» demandePartageId|string|false|none|none|
|»»» montant|number|false|none|none|
|»»» typePaiement|string|false|none|none|
|»»» statut|string|false|none|none|
|»»» createdAt|string(date-time)¦null|false|none|none|
|»»» updatedAt|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|typePaiement|MOBILE_MONEY|
|typePaiement|BANK_TRANSFER|
|typePaiement|CARD|
|typePaiement|CASH|
|statut|PENDING|
|statut|SUCCESS|
|statut|FAILED|
|statut|CANCELED|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__demandes_{id}_assign

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/demandes/{id}/assign \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/demandes/{id}/assign HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "assignedOrgId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}/assign',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/demandes/{id}/assign',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/demandes/{id}/assign', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/demandes/{id}/assign', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}/assign");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/demandes/{id}/assign", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /demandes/{id}/assign`

*Assigne (ou désassigne) une organisation à une demande*

> Body parameter

```json
{
  "assignedOrgId": "string"
}
```

<h3 id="patch__demandes_{id}_assign-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|true|none|
|» assignedOrgId|body|string¦null|false|Laisser vide/null pour désassigner|

> Example responses

> 200 Response

```json
{
  "message": "Assignation mise à jour",
  "demande": {
    "id": "string",
    "code": "string",
    "dateDemande": "2019-08-24T14:15:22Z",
    "isDeleted": true,
    "status": "string",
    "user": {
      "id": "string",
      "email": "user@example.com",
      "username": "string"
    },
    "targetOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "assignedOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "meta": {
      "serie": "string",
      "niveau": "string",
      "mention": "string",
      "annee": "string",
      "countryOfSchool": "string",
      "secondarySchoolName": "string",
      "graduationDate": "2019-08-24T14:15:22Z"
    },
    "documentsCount": 0,
    "transaction": {
      "id": "string",
      "demandePartageId": "string",
      "montant": 0,
      "typePaiement": "MOBILE_MONEY",
      "statut": "PENDING",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

<h3 id="patch__demandes_{id}_assign-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Assignation mise à jour|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Organisation assignée invalide|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Demande introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="patch__demandes_{id}_assign-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» demande|[Demande](#schemademande)|false|none|none|
|»» id|string|false|none|none|
|»» code|string¦null|false|none|none|
|»» dateDemande|string(date-time)|false|none|none|
|»» isDeleted|boolean|false|none|none|
|»» status|string¦null|false|none|none|
|»» user|[UserLite](#schemauserlite)|false|none|none|
|»»» id|string|false|none|none|
|»»» email|string(email)|false|none|none|
|»»» username|string|false|none|none|
|»» targetOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|»»» id|string|false|none|none|
|»»» name|string|false|none|none|
|»»» slug|string|false|none|none|
|»»» type|string¦null|false|none|none|
|»» assignedOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|»» meta|object|false|none|none|
|»»» serie|string¦null|false|none|none|
|»»» niveau|string¦null|false|none|none|
|»»» mention|string¦null|false|none|none|
|»»» annee|string¦null|false|none|none|
|»»» countryOfSchool|string¦null|false|none|none|
|»»» secondarySchoolName|string¦null|false|none|none|
|»»» graduationDate|string(date-time)¦null|false|none|none|
|»» documentsCount|integer|false|none|none|
|»» transaction|[Transaction](#schematransaction)|false|none|none|
|»»» id|string|false|none|none|
|»»» demandePartageId|string|false|none|none|
|»»» montant|number|false|none|none|
|»»» typePaiement|string|false|none|none|
|»»» statut|string|false|none|none|
|»»» createdAt|string(date-time)¦null|false|none|none|
|»»» updatedAt|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|typePaiement|MOBILE_MONEY|
|typePaiement|BANK_TRANSFER|
|typePaiement|CARD|
|typePaiement|CASH|
|statut|PENDING|
|statut|SUCCESS|
|statut|FAILED|
|statut|CANCELED|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__demandes_{id}_restore

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/demandes/{id}/restore \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/demandes/{id}/restore HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}/restore',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/demandes/{id}/restore',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/demandes/{id}/restore', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/demandes/{id}/restore', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}/restore");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/demandes/{id}/restore", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /demandes/{id}/restore`

*Restaure une demande archivée*

<h3 id="patch__demandes_{id}_restore-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Opération effectuée"
}
```

<h3 id="patch__demandes_{id}_restore-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Demande restaurée|[MessageOnly](#schemamessageonly)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__demandes_{id}_hard-delete

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/demandes/{id}/hard-delete \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/demandes/{id}/hard-delete HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}/hard-delete',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/demandes/{id}/hard-delete',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/demandes/{id}/hard-delete', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/demandes/{id}/hard-delete', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}/hard-delete");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/demandes/{id}/hard-delete", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /demandes/{id}/hard-delete`

*Supprime définitivement une demande*

<h3 id="delete__demandes_{id}_hard-delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Opération effectuée"
}
```

<h3 id="delete__demandes_{id}_hard-delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Demande supprimée définitivement|[MessageOnly](#schemamessageonly)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Demande introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__demandes_{id}_documents

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/demandes/{id}/documents \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/demandes/{id}/documents HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}/documents',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/demandes/{id}/documents',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/demandes/{id}/documents', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/demandes/{id}/documents', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}/documents");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/demandes/{id}/documents", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /demandes/{id}/documents`

*Liste les documents d'une demande*

<h3 id="get__demandes_{id}_documents-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "documents": [
    {
      "id": "string",
      "demandePartageId": "string",
      "ownerOrgId": "string",
      "codeAdn": "string",
      "estTraduit": true,
      "aDocument": true,
      "hasOriginal": true,
      "hasTraduit": true,
      "isEncrypted": true,
      "urlOriginal": "http://example.com",
      "urlTraduit": "http://example.com",
      "urlChiffre": "http://example.com",
      "blockchainHash": "string",
      "encryptedBy": "string",
      "encryptedAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ]
}
```

<h3 id="get__demandes_{id}_documents-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Liste des documents|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__demandes_{id}_documents-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» documents|[[Document](#schemadocument)]|false|none|none|
|»» id|string|false|none|none|
|»» demandePartageId|string|false|none|none|
|»» ownerOrgId|string|false|none|none|
|»» codeAdn|string¦null|false|none|none|
|»» estTraduit|boolean|false|none|none|
|»» aDocument|boolean|false|none|none|
|»» hasOriginal|boolean¦null|false|none|none|
|»» hasTraduit|boolean¦null|false|none|none|
|»» isEncrypted|boolean¦null|false|none|none|
|»» urlOriginal|string(uri)¦null|false|none|none|
|»» urlTraduit|string(uri)¦null|false|none|none|
|»» urlChiffre|string(uri)¦null|false|none|none|
|»» blockchainHash|string¦null|false|none|none|
|»» encryptedBy|string¦null|false|none|none|
|»» encryptedAt|string(date-time)¦null|false|none|none|
|»» createdAt|string(date-time)¦null|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__demandes_{id}_documents

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/demandes/{id}/documents \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/demandes/{id}/documents HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "ownerOrgId": "string",
  "urlOriginal": "http://example.com",
  "codeAdn": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}/documents',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/demandes/{id}/documents',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/demandes/{id}/documents', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/demandes/{id}/documents', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}/documents");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/demandes/{id}/documents", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /demandes/{id}/documents`

*Ajoute un document à une demande (chiffrement automatique si urlOriginal)*

> Body parameter

```json
{
  "ownerOrgId": "string",
  "urlOriginal": "http://example.com",
  "codeAdn": "string"
}
```

<h3 id="post__demandes_{id}_documents-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|true|none|
|» ownerOrgId|body|string|true|none|
|» urlOriginal|body|string(uri)¦null|false|none|
|» codeAdn|body|string¦null|false|none|

> Example responses

> 201 Response

```json
{
  "message": "Document enregistré et chiffré",
  "document": {
    "id": "string",
    "demandePartageId": "string",
    "ownerOrgId": "string",
    "codeAdn": "string",
    "estTraduit": true,
    "aDocument": true,
    "hasOriginal": true,
    "hasTraduit": true,
    "isEncrypted": true,
    "urlOriginal": "http://example.com",
    "urlTraduit": "http://example.com",
    "urlChiffre": "http://example.com",
    "blockchainHash": "string",
    "encryptedBy": "string",
    "encryptedAt": "2019-08-24T14:15:22Z",
    "createdAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="post__demandes_{id}_documents-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Document créé (et chiffré si applicable)|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ownerOrgId manquant|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="post__demandes_{id}_documents-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» document|[Document](#schemadocument)|false|none|none|
|»» id|string|false|none|none|
|»» demandePartageId|string|false|none|none|
|»» ownerOrgId|string|false|none|none|
|»» codeAdn|string¦null|false|none|none|
|»» estTraduit|boolean|false|none|none|
|»» aDocument|boolean|false|none|none|
|»» hasOriginal|boolean¦null|false|none|none|
|»» hasTraduit|boolean¦null|false|none|none|
|»» isEncrypted|boolean¦null|false|none|none|
|»» urlOriginal|string(uri)¦null|false|none|none|
|»» urlTraduit|string(uri)¦null|false|none|none|
|»» urlChiffre|string(uri)¦null|false|none|none|
|»» blockchainHash|string¦null|false|none|none|
|»» encryptedBy|string¦null|false|none|none|
|»» encryptedAt|string(date-time)¦null|false|none|none|
|»» createdAt|string(date-time)¦null|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__demandes_{id}_payments

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/demandes/{id}/payments \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/demandes/{id}/payments HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "provider": "STRIPE",
  "amount": 100.5,
  "currency": "USD",
  "paymentType": "MOBILE_MONEY"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{id}/payments',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/demandes/{id}/payments',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/demandes/{id}/payments', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/demandes/{id}/payments', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{id}/payments");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/demandes/{id}/payments", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /demandes/{id}/payments`

*Crée un paiement pour une demande*

> Body parameter

```json
{
  "provider": "STRIPE",
  "amount": 100.5,
  "currency": "USD",
  "paymentType": "MOBILE_MONEY"
}
```

<h3 id="post__demandes_{id}_payments-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|true|none|
|» provider|body|string|true|none|
|» amount|body|number|true|none|
|» currency|body|string|true|none|
|» paymentType|body|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» paymentType|MOBILE_MONEY|
|» paymentType|BANK_TRANSFER|
|» paymentType|CARD|
|» paymentType|CASH|

> Example responses

> 201 Response

```json
{
  "message": "Paiement créé",
  "payment": {
    "id": "string",
    "provider": "string",
    "status": "INITIATED",
    "amount": 0,
    "currency": "string",
    "paymentType": "MOBILE_MONEY",
    "providerRef": "string",
    "paymentInfo": {},
    "demandePartageId": "string",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="post__demandes_{id}_payments-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Paiement créé|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Demande introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="post__demandes_{id}_payments-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» payment|[Payment](#schemapayment)|false|none|none|
|»» id|string|false|none|none|
|»» provider|string|false|none|none|
|»» status|string|false|none|none|
|»» amount|number|false|none|none|
|»» currency|string|false|none|none|
|»» paymentType|string|false|none|none|
|»» providerRef|string¦null|false|none|none|
|»» paymentInfo|object¦null|false|none|none|
|»» demandePartageId|string¦null|false|none|none|
|»» createdAt|string(date-time)¦null|false|none|none|
|»» updatedAt|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|INITIATED|
|status|REQUIRES_ACTION|
|status|AUTHORIZED|
|status|CAPTURED|
|status|CANCELED|
|status|FAILED|
|paymentType|MOBILE_MONEY|
|paymentType|BANK_TRANSFER|
|paymentType|CARD|
|paymentType|CASH|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__demandes_{demandeId}_payments

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/demandes/{demandeId}/payments \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/demandes/{demandeId}/payments HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "status": "INITIATED",
  "providerRef": "string",
  "paymentInfo": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/{demandeId}/payments',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/demandes/{demandeId}/payments',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/demandes/{demandeId}/payments', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/demandes/{demandeId}/payments', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/{demandeId}/payments");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/demandes/{demandeId}/payments", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /demandes/{demandeId}/payments`

*Met à jour le statut d'un paiement d'une demande*

> Body parameter

```json
{
  "status": "INITIATED",
  "providerRef": "string",
  "paymentInfo": {}
}
```

<h3 id="patch__demandes_{demandeid}_payments-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|demandeId|path|string|true|none|
|body|body|object|true|none|
|» status|body|string|true|none|
|» providerRef|body|string¦null|false|none|
|» paymentInfo|body|object¦null|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» status|INITIATED|
|» status|REQUIRES_ACTION|
|» status|AUTHORIZED|
|» status|CAPTURED|
|» status|CANCELED|
|» status|FAILED|

> Example responses

> 200 Response

```json
{
  "message": "Statut paiement mis à jour",
  "payment": {
    "id": "string",
    "provider": "string",
    "status": "INITIATED",
    "amount": 0,
    "currency": "string",
    "paymentType": "MOBILE_MONEY",
    "providerRef": "string",
    "paymentInfo": {},
    "demandePartageId": "string",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="patch__demandes_{demandeid}_payments-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Statut paiement mis à jour|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="patch__demandes_{demandeid}_payments-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» payment|[Payment](#schemapayment)|false|none|none|
|»» id|string|false|none|none|
|»» provider|string|false|none|none|
|»» status|string|false|none|none|
|»» amount|number|false|none|none|
|»» currency|string|false|none|none|
|»» paymentType|string|false|none|none|
|»» providerRef|string¦null|false|none|none|
|»» paymentInfo|object¦null|false|none|none|
|»» demandePartageId|string¦null|false|none|none|
|»» createdAt|string(date-time)¦null|false|none|none|
|»» updatedAt|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|INITIATED|
|status|REQUIRES_ACTION|
|status|AUTHORIZED|
|status|CAPTURED|
|status|CANCELED|
|status|FAILED|
|paymentType|MOBILE_MONEY|
|paymentType|BANK_TRANSFER|
|paymentType|CARD|
|paymentType|CASH|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__demandes_stats

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/demandes/stats \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/demandes/stats HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/demandes/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/demandes/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/demandes/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/demandes/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /demandes/stats`

*Statistiques des demandes (mensuelles & par statut)*

<h3 id="get__demandes_stats-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|orgId|query|string|false|Filtrer par organisation cible|
|assignedOrgId|query|string|false|Filtrer par organisation assignée|
|months|query|integer|false|Nombre de mois à retourner|

> Example responses

> 200 Response

```json
{
  "monthly": [
    {
      "month": "2019-08-24T14:15:22Z",
      "total": 0
    }
  ],
  "byStatus": [
    {
      "status": "string",
      "count": 0
    }
  ]
}
```

<h3 id="get__demandes_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Statistiques agrégées|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__demandes_stats-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» monthly|[object]|false|none|none|
|»» month|string(date-time)|false|none|none|
|»» total|integer|false|none|none|
|» byStatus|[object]|false|none|none|
|»» status|string|false|none|none|
|»» count|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__demandes_documents_{documentId}_content

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/demandes/documents/{documentId}/content \
  -H 'Accept: application/pdf' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/demandes/documents/{documentId}/content HTTP/1.1
Host: localhost:5000
Accept: application/pdf

```

```javascript

const headers = {
  'Accept':'application/pdf',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/demandes/documents/{documentId}/content',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/pdf',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/demandes/documents/{documentId}/content',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/pdf',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/demandes/documents/{documentId}/content', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/pdf',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/demandes/documents/{documentId}/content', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/demandes/documents/{documentId}/content");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/pdf"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/demandes/documents/{documentId}/content", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /demandes/documents/{documentId}/content`

*Récupère le contenu d'un document (original ou traduit)*

Retourne un flux PDF. Si le document est chiffré, il est déchiffré côté serveur après vérification d'intégrité.

<h3 id="get__demandes_documents_{documentid}_content-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|documentId|path|string|true|none|
|type|query|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|type|original|
|type|traduit|

> Example responses

> 200 Response

<h3 id="get__demandes_documents_{documentid}_content-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Flux PDF|string|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Accès refusé ou violation d'intégrité détectée|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Document introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-departments">Departments</h1>

Gestion des départements

## get__departments

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/departments \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/departments HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/departments',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/departments',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/departments', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/departments', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/departments");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/departments", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /departments`

*Liste des départements*

<h3 id="get__departments-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__departments

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/departments \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/departments HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/departments',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/departments',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/departments', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/departments', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/departments");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/departments", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /departments`

*Crée un nouveau département*

<h3 id="post__departments-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__departments_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/departments/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/departments/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/departments/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/departments/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/departments/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/departments/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/departments/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/departments/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /departments/{id}`

*Récupère un département par ID*

<h3 id="get__departments_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__departments_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:5000/departments/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:5000/departments/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/departments/{id}',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:5000/departments/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:5000/departments/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:5000/departments/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/departments/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:5000/departments/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /departments/{id}`

*Met à jour un département*

<h3 id="put__departments_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__departments_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/departments/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/departments/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/departments/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/departments/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/departments/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/departments/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/departments/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/departments/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /departments/{id}`

*Supprime un département*

<h3 id="delete__departments_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__departments_{id}_filieres

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/departments/{id}/filieres \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/departments/{id}/filieres HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/departments/{id}/filieres',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/departments/{id}/filieres',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/departments/{id}/filieres', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/departments/{id}/filieres', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/departments/{id}/filieres");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/departments/{id}/filieres", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /departments/{id}/filieres`

*Liste des filières d'un département*

<h3 id="get__departments_{id}_filieres-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__departments_{id}_filieres

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/departments/{id}/filieres \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/departments/{id}/filieres HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/departments/{id}/filieres',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/departments/{id}/filieres',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/departments/{id}/filieres', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/departments/{id}/filieres', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/departments/{id}/filieres");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/departments/{id}/filieres", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /departments/{id}/filieres`

*Crée une filière dans un département*

<h3 id="post__departments_{id}_filieres-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__departments_export_csv

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/departments/export/csv \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/departments/export/csv HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/departments/export/csv',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/departments/export/csv',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/departments/export/csv', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/departments/export/csv', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/departments/export/csv");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/departments/export/csv", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /departments/export/csv`

*Exporte les départements en CSV*

<h3 id="get__departments_export_csv-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__departments_stats

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/departments/stats \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/departments/stats HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/departments/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/departments/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/departments/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/departments/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/departments/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/departments/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /departments/stats`

*Statistiques des départements*

<h3 id="get__departments_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-documents">Documents</h1>

Gestion des documents

## get__documents

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/documents \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/documents HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/documents',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/documents',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/documents', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/documents', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/documents");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/documents", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /documents`

*Liste des documents*

<h3 id="get__documents-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__documents

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/documents \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/documents HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/documents',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/documents',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/documents', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/documents', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/documents");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/documents", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /documents`

*Crée un nouveau document (avec chiffrement automatique)*

<h3 id="post__documents-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__documents_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/documents/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/documents/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/documents/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/documents/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/documents/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/documents/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/documents/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/documents/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /documents/{id}`

*Récupère un document par ID*

<h3 id="get__documents_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__documents_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:5000/documents/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:5000/documents/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/documents/{id}',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:5000/documents/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:5000/documents/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:5000/documents/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/documents/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:5000/documents/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /documents/{id}`

*Met à jour un document*

<h3 id="put__documents_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__documents_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/documents/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/documents/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/documents/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/documents/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/documents/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/documents/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/documents/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/documents/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /documents/{id}`

*Supprime un document*

<h3 id="delete__documents_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__documents_{id}_traduire

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/documents/{id}/traduire \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/documents/{id}/traduire HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/documents/{id}/traduire',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/documents/{id}/traduire',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/documents/{id}/traduire', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/documents/{id}/traduire', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/documents/{id}/traduire");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/documents/{id}/traduire", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /documents/{id}/traduire`

*Marque un document comme traduit et chiffre la traduction*

<h3 id="post__documents_{id}_traduire-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__documents_{id}_content

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/documents/{id}/content \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/documents/{id}/content HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/documents/{id}/content',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/documents/{id}/content',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/documents/{id}/content', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/documents/{id}/content', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/documents/{id}/content");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/documents/{id}/content", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /documents/{id}/content`

*Récupère le contenu d'un document (original, traduit ou chiffré)*

<h3 id="get__documents_{id}_content-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__documents_{id}_info

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/documents/{id}/info \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/documents/{id}/info HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/documents/{id}/info',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/documents/{id}/info',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/documents/{id}/info', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/documents/{id}/info', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/documents/{id}/info");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/documents/{id}/info", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /documents/{id}/info`

*Récupère les informations d'un document pour affichage dans le frontend*

<h3 id="get__documents_{id}_info-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__documents_{id}_verify

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/documents/{id}/verify \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/documents/{id}/verify HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/documents/{id}/verify',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/documents/{id}/verify',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/documents/{id}/verify', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/documents/{id}/verify', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/documents/{id}/verify");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/documents/{id}/verify", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /documents/{id}/verify`

*Vérifie l'intégrité d'un document*

<h3 id="get__documents_{id}_verify-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-filieres">Filieres</h1>

Gestion des filières

## get__filieres

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/filieres \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/filieres HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/filieres',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/filieres',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/filieres', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/filieres', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/filieres");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/filieres", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /filieres`

*Liste des filières*

<h3 id="get__filieres-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer|false|Numéro de page (1-n)|
|limit|query|integer|false|Taille de page|
|departmentId|query|string|false|Filtrer par ID de département|
|search|query|string|false|Terme de recherche (nom)|
|level|query|string|false|Filtrer par niveau (ex. Licence, Master)|
|withDepartment|query|string|false|Inclure les infos de département|

#### Enumerated Values

|Parameter|Value|
|---|---|
|withDepartment|true|
|withDepartment|false|

> Example responses

> 200 Response

```json
{
  "filieres": [
    {
      "id": "string",
      "departmentId": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "level": "string",
      "department": {
        "id": "string",
        "organizationId": "string",
        "name": "string",
        "code": "string",
        "description": "string"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 123,
    "pages": 13
  },
  "filters": {
    "departmentId": "string",
    "search": "string",
    "level": "string",
    "withDepartment": true
  }
}
```

<h3 id="get__filieres-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Liste des filières|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__filieres-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» filieres|[[Filiere](#schemafiliere)]|false|none|none|
|»» id|string|false|none|none|
|»» departmentId|string|false|none|none|
|»» name|string|false|none|none|
|»» code|string|false|none|none|
|»» description|string|false|none|none|
|»» level|string|false|none|none|
|»» department|[Department](#schemadepartment)|false|none|none|
|»»» id|string|false|none|none|
|»»» organizationId|string|false|none|none|
|»»» name|string|false|none|none|
|»»» code|string|false|none|none|
|»»» description|string|false|none|none|
|» pagination|[Pagination](#schemapagination)|false|none|none|
|»» page|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» total|integer|false|none|none|
|»» pages|integer|false|none|none|
|» filters|object|false|none|none|
|»» departmentId|string|false|none|none|
|»» search|string|false|none|none|
|»» level|string|false|none|none|
|»» withDepartment|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__filieres

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/filieres \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/filieres HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = 'false';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/filieres',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/filieres',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/filieres', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/filieres', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/filieres");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/filieres", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /filieres`

*Crée une nouvelle filière*

> Body parameter

```json
false
```

> Example responses

> 201 Response

```json
{
  "message": "Filière créée",
  "filiere": {
    "id": "string",
    "departmentId": "string",
    "name": "string",
    "code": "string",
    "description": "string",
    "level": "string",
    "department": {
      "id": "string",
      "organizationId": "string",
      "name": "string",
      "code": "string",
      "description": "string"
    }
  }
}
```

<h3 id="post__filieres-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Filière créée|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Erreurs de validation ou département introuvable|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Filière du même nom déjà existante dans le département|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="post__filieres-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» filiere|[Filiere](#schemafiliere)|false|none|none|
|»» id|string|false|none|none|
|»» departmentId|string|false|none|none|
|»» name|string|false|none|none|
|»» code|string|false|none|none|
|»» description|string|false|none|none|
|»» level|string|false|none|none|
|»» department|[Department](#schemadepartment)|false|none|none|
|»»» id|string|false|none|none|
|»»» organizationId|string|false|none|none|
|»»» name|string|false|none|none|
|»»» code|string|false|none|none|
|»»» description|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__filieres_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/filieres/{id} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/filieres/{id} HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/filieres/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/filieres/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/filieres/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/filieres/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/filieres/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/filieres/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /filieres/{id}`

*Récupère une filière par ID*

<h3 id="get__filieres_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|ID de la filière|

> Example responses

> 200 Response

```json
{
  "filiere": {
    "id": "string",
    "departmentId": "string",
    "name": "string",
    "code": "string",
    "description": "string",
    "level": "string",
    "department": {
      "id": "string",
      "organizationId": "string",
      "name": "string",
      "code": "string",
      "description": "string"
    }
  }
}
```

<h3 id="get__filieres_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Détails de la filière|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Filière introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__filieres_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» filiere|[Filiere](#schemafiliere)|false|none|none|
|»» id|string|false|none|none|
|»» departmentId|string|false|none|none|
|»» name|string|false|none|none|
|»» code|string|false|none|none|
|»» description|string|false|none|none|
|»» level|string|false|none|none|
|»» department|[Department](#schemadepartment)|false|none|none|
|»»» id|string|false|none|none|
|»»» organizationId|string|false|none|none|
|»»» name|string|false|none|none|
|»»» code|string|false|none|none|
|»»» description|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__filieres_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:5000/filieres/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:5000/filieres/{id} HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = 'false';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/filieres/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:5000/filieres/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:5000/filieres/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:5000/filieres/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/filieres/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:5000/filieres/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /filieres/{id}`

*Met à jour une filière*

> Body parameter

```json
false
```

<h3 id="put__filieres_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|ID de la filière|

> Example responses

> 200 Response

```json
{
  "message": "Filière mise à jour",
  "filiere": {
    "id": "string",
    "departmentId": "string",
    "name": "string",
    "code": "string",
    "description": "string",
    "level": "string",
    "department": {
      "id": "string",
      "organizationId": "string",
      "name": "string",
      "code": "string",
      "description": "string"
    }
  }
}
```

<h3 id="put__filieres_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Filière mise à jour|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Filière introuvable|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Conflit de nom dans le même département|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="put__filieres_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» filiere|[Filiere](#schemafiliere)|false|none|none|
|»» id|string|false|none|none|
|»» departmentId|string|false|none|none|
|»» name|string|false|none|none|
|»» code|string|false|none|none|
|»» description|string|false|none|none|
|»» level|string|false|none|none|
|»» department|[Department](#schemadepartment)|false|none|none|
|»»» id|string|false|none|none|
|»»» organizationId|string|false|none|none|
|»»» name|string|false|none|none|
|»»» code|string|false|none|none|
|»»» description|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__filieres_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/filieres/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/filieres/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/filieres/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/filieres/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/filieres/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/filieres/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/filieres/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/filieres/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /filieres/{id}`

*Supprime une filière*

<h3 id="delete__filieres_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|ID de la filière|

<h3 id="delete__filieres_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Filière supprimée|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Filière introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__filieres_by-organization

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/filieres/by-organization?organizationId=string \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/filieres/by-organization?organizationId=string HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/filieres/by-organization?organizationId=string',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/filieres/by-organization',
  params: {
  'organizationId' => 'string'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/filieres/by-organization', params={
  'organizationId': 'string'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/filieres/by-organization', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/filieres/by-organization?organizationId=string");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/filieres/by-organization", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /filieres/by-organization`

*Liste des filières d'une organisation*

<h3 id="get__filieres_by-organization-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|organizationId|query|string|true|ID de l'organisation|
|page|query|integer|false|Numéro de page (1-n)|
|limit|query|integer|false|Taille de page|
|search|query|string|false|Terme de recherche (nom)|
|level|query|string|false|Filtrer par niveau|

> Example responses

> 200 Response

```json
{
  "filieres": [
    {
      "id": "string",
      "departmentId": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "level": "string",
      "department": {
        "id": "string",
        "organizationId": "string",
        "name": "string",
        "code": "string",
        "description": "string"
      },
      "organization": {
        "id": "string",
        "name": "string",
        "slug": "string"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 123,
    "pages": 13
  },
  "filters": {
    "organizationId": "string",
    "search": "string",
    "level": "string"
  }
}
```

<h3 id="get__filieres_by-organization-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Liste des filières par organisation|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|organizationId manquant|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__filieres_by-organization-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» filieres|[allOf]|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|[Filiere](#schemafiliere)|false|none|none|
|»»» id|string|false|none|none|
|»»» departmentId|string|false|none|none|
|»»» name|string|false|none|none|
|»»» code|string|false|none|none|
|»»» description|string|false|none|none|
|»»» level|string|false|none|none|
|»»» department|[Department](#schemadepartment)|false|none|none|
|»»»» id|string|false|none|none|
|»»»» organizationId|string|false|none|none|
|»»»» name|string|false|none|none|
|»»»» code|string|false|none|none|
|»»»» description|string|false|none|none|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» organization|object¦null|false|none|none|
|»»»» id|string|false|none|none|
|»»»» name|string|false|none|none|
|»»»» slug|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» pagination|[Pagination](#schemapagination)|false|none|none|
|»» page|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» total|integer|false|none|none|
|»» pages|integer|false|none|none|
|» filters|object|false|none|none|
|»» organizationId|string|false|none|none|
|»» search|string|false|none|none|
|»» level|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__filieres_stats

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/filieres/stats \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/filieres/stats HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/filieres/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/filieres/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/filieres/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/filieres/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/filieres/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/filieres/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /filieres/stats`

*Statistiques des filières*

<h3 id="get__filieres_stats-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|departmentId|query|string|false|Filtrer par ID de département|
|organizationId|query|string|false|Filtrer par ID d'organisation|

> Example responses

> 200 Response

```json
{
  "byLevel": [
    {
      "level": "string",
      "count": 0
    }
  ]
}
```

<h3 id="get__filieres_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Statistiques par niveau|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__filieres_stats-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» byLevel|[object]|false|none|none|
|»» level|string|false|none|none|
|»» count|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-organizations">Organizations</h1>

Gestion des organisations

## get__organizations

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/organizations \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/organizations HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/organizations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/organizations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/organizations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/organizations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /organizations`

*Liste des organisations*

<h3 id="get__organizations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer|false|Numéro de page (1-n)|
|limit|query|integer|false|Taille de page|
|sortBy|query|string|false|Champ de tri (selon ressource)|
|sortOrder|query|string|false|Ordre de tri|
|type|query|string|false|Filtrer par type d'organisation|
|country|query|string|false|Filtrer par pays|
|search|query|string|false|Recherche plein texte (name, email, phone...)|
|withDeleted|query|string|false|Inclure les éléments supprimés|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sortOrder|asc|
|sortOrder|desc|
|withDeleted|true|
|withDeleted|false|

> Example responses

> 200 Response

```json
{
  "organizations": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string",
      "email": "user@example.com",
      "phone": "string",
      "address": "string",
      "website": "string",
      "country": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 123,
    "pages": 13
  },
  "filters": {}
}
```

<h3 id="get__organizations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Liste des organisations|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__organizations-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» organizations|[[Organization](#schemaorganization)]|false|none|none|
|»» id|string|false|none|none|
|»» name|string|false|none|none|
|»» slug|string|false|none|none|
|»» type|string|false|none|none|
|»» email|string(email)|false|none|none|
|»» phone|string|false|none|none|
|»» address|string|false|none|none|
|»» website|string|false|none|none|
|»» country|string|false|none|none|
|» pagination|[Pagination](#schemapagination)|false|none|none|
|»» page|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» total|integer|false|none|none|
|»» pages|integer|false|none|none|
|» filters|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__organizations

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/organizations \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/organizations HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "Université X",
  "slug": "universite-x",
  "type": "INSTITUTION",
  "email": "user@example.com",
  "phone": "string",
  "address": "string",
  "website": "string",
  "country": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/organizations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/organizations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/organizations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/organizations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /organizations`

*Crée une organisation*

> Body parameter

```json
{
  "name": "Université X",
  "slug": "universite-x",
  "type": "INSTITUTION",
  "email": "user@example.com",
  "phone": "string",
  "address": "string",
  "website": "string",
  "country": "string"
}
```

<h3 id="post__organizations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|none|
|» slug|body|string|false|none|
|» type|body|string|true|none|
|» email|body|string(email)|false|none|
|» phone|body|string|false|none|
|» address|body|string|false|none|
|» website|body|string|false|none|
|» country|body|string|false|none|

> Example responses

> 201 Response

```json
{
  "message": "Organisation créée",
  "organization": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "type": "string",
    "email": "user@example.com",
    "phone": "string",
    "address": "string",
    "website": "string",
    "country": "string"
  }
}
```

<h3 id="post__organizations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Organisation créée|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Erreurs de validation|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Conflit (slug déjà pris, etc.)|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="post__organizations-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» organization|[Organization](#schemaorganization)|false|none|none|
|»» id|string|false|none|none|
|»» name|string|false|none|none|
|»» slug|string|false|none|none|
|»» type|string|false|none|none|
|»» email|string(email)|false|none|none|
|»» phone|string|false|none|none|
|»» address|string|false|none|none|
|»» website|string|false|none|none|
|»» country|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__organizations_check-slug

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/organizations/check-slug \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/organizations/check-slug HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations/check-slug',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/organizations/check-slug',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/organizations/check-slug', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/organizations/check-slug', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations/check-slug");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/organizations/check-slug", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /organizations/check-slug`

*Vérifie la disponibilité d'un slug (par slug ou name)*

<h3 id="get__organizations_check-slug-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|slug|query|string|false|Slug souhaité (facultatif)|
|name|query|string|false|Nom (pour proposer un slug si aucun slug fourni)|

> Example responses

> 200 Response

```json
{
  "available": true,
  "slug": "string"
}
```

<h3 id="get__organizations_check-slug-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Résultat de la vérification|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__organizations_check-slug-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» available|boolean|false|none|none|
|» slug|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__organizations_stats

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/organizations/stats \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/organizations/stats HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/organizations/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/organizations/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/organizations/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/organizations/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /organizations/stats`

*Statistiques sur les organisations*

<h3 id="get__organizations_stats-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|withDeleted|query|string|false|Inclure les éléments supprimés|

#### Enumerated Values

|Parameter|Value|
|---|---|
|withDeleted|true|
|withDeleted|false|

> Example responses

> 200 Response

```json
{
  "total": 0,
  "byType": [
    {
      "type": "string",
      "count": 0
    }
  ]
}
```

<h3 id="get__organizations_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Statistiques|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__organizations_stats-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» total|integer|false|none|none|
|» byType|[object]|false|none|none|
|»» type|string|false|none|none|
|»» count|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__organizations_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/organizations/{id} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/organizations/{id} HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/organizations/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/organizations/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/organizations/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/organizations/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /organizations/{id}`

*Récupère une organisation*

<h3 id="get__organizations_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "organization": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "type": "string",
    "email": "user@example.com",
    "phone": "string",
    "address": "string",
    "website": "string",
    "country": "string"
  }
}
```

<h3 id="get__organizations_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Détails de l'organisation|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Organisation introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__organizations_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» organization|[Organization](#schemaorganization)|false|none|none|
|»» id|string|false|none|none|
|»» name|string|false|none|none|
|»» slug|string|false|none|none|
|»» type|string|false|none|none|
|»» email|string(email)|false|none|none|
|»» phone|string|false|none|none|
|»» address|string|false|none|none|
|»» website|string|false|none|none|
|»» country|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__organizations_{id}

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/organizations/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/organizations/{id} HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "id": "string",
  "name": "string",
  "slug": "string",
  "type": "string",
  "email": "user@example.com",
  "phone": "string",
  "address": "string",
  "website": "string",
  "country": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/organizations/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/organizations/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/organizations/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/organizations/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /organizations/{id}`

*Met à jour une organisation (partiel)*

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "type": "string",
  "email": "user@example.com",
  "phone": "string",
  "address": "string",
  "website": "string",
  "country": "string"
}
```

<h3 id="patch__organizations_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Organization](#schemaorganization)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Organisation mise à jour",
  "organization": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "type": "string",
    "email": "user@example.com",
    "phone": "string",
    "address": "string",
    "website": "string",
    "country": "string"
  }
}
```

<h3 id="patch__organizations_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Organisation mise à jour|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Erreurs de validation|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Organisation introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="patch__organizations_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» organization|[Organization](#schemaorganization)|false|none|none|
|»» id|string|false|none|none|
|»» name|string|false|none|none|
|»» slug|string|false|none|none|
|»» type|string|false|none|none|
|»» email|string(email)|false|none|none|
|»» phone|string|false|none|none|
|»» address|string|false|none|none|
|»» website|string|false|none|none|
|»» country|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__organizations_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/organizations/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/organizations/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/organizations/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/organizations/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/organizations/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/organizations/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /organizations/{id}`

*Archive (soft delete) une organisation*

<h3 id="delete__organizations_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="delete__organizations_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Organisation archivée|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Organisation introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__organizations_{id}_restore

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/organizations/{id}/restore \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/organizations/{id}/restore HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations/{id}/restore',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/organizations/{id}/restore',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/organizations/{id}/restore', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/organizations/{id}/restore', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations/{id}/restore");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/organizations/{id}/restore", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /organizations/{id}/restore`

*Restaure une organisation archivée*

<h3 id="post__organizations_{id}_restore-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="post__organizations_{id}_restore-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Organisation restaurée|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Organisation introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__organizations_{id}_hard

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/organizations/{id}/hard \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/organizations/{id}/hard HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations/{id}/hard',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/organizations/{id}/hard',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/organizations/{id}/hard', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/organizations/{id}/hard', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations/{id}/hard");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/organizations/{id}/hard", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /organizations/{id}/hard`

*Suppression définitive d'une organisation*

<h3 id="delete__organizations_{id}_hard-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="delete__organizations_{id}_hard-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Organisation supprimée définitivement|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Organisation introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__organizations_{id}_users

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/organizations/{id}/users \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/organizations/{id}/users HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations/{id}/users',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/organizations/{id}/users',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/organizations/{id}/users', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/organizations/{id}/users', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations/{id}/users");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/organizations/{id}/users", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /organizations/{id}/users`

*Liste les utilisateurs d'une organisation*

<h3 id="get__organizations_{id}_users-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|page|query|integer|false|Numéro de page (1-n)|
|limit|query|integer|false|Taille de page|
|search|query|string|false|none|
|role|query|string|false|none|
|sortBy|query|string|false|Champ de tri (selon ressource)|
|sortOrder|query|string|false|Ordre de tri|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sortOrder|asc|
|sortOrder|desc|

> Example responses

> 200 Response

```json
{
  "users": [
    {
      "id": "string",
      "email": "user@example.com",
      "username": "string",
      "role": "DEMANDEUR",
      "enabled": true,
      "phone": "string",
      "avatar": "string",
      "country": "string",
      "organization": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "type": "string"
      },
      "permissions": [
        {
          "key": "string",
          "name": "string"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 123,
    "pages": 13
  }
}
```

<h3 id="get__organizations_{id}_users-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Utilisateurs de l'organisation|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Organisation introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__organizations_{id}_users-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» users|[[User](#schemauser)]|false|none|none|
|»» id|string|false|none|none|
|»» email|string(email)|false|none|none|
|»» username|string|false|none|none|
|»» role|string|false|none|none|
|»» enabled|boolean|false|none|none|
|»» phone|string|false|none|none|
|»» avatar|string|false|none|none|
|»» country|string|false|none|none|
|»» organization|object|false|none|none|
|»»» id|string|false|none|none|
|»»» name|string|false|none|none|
|»»» slug|string|false|none|none|
|»»» type|string|false|none|none|
|»» permissions|[object]|false|none|none|
|»»» key|string|false|none|none|
|»»» name|string|false|none|none|
|» pagination|[Pagination](#schemapagination)|false|none|none|
|»» page|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» total|integer|false|none|none|
|»» pages|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|role|DEMANDEUR|
|role|INSTITUT|
|role|TRADUCTEUR|
|role|SUPERVISEUR|
|role|ADMIN|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__organizations_{id}_departments

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/organizations/{id}/departments \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/organizations/{id}/departments HTTP/1.1
Host: localhost:5000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/organizations/{id}/departments',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/organizations/{id}/departments',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/organizations/{id}/departments', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/organizations/{id}/departments', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/organizations/{id}/departments");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/organizations/{id}/departments", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /organizations/{id}/departments`

*Liste les départements d'une organisation*

<h3 id="get__organizations_{id}_departments-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|page|query|integer|false|Numéro de page (1-n)|
|limit|query|integer|false|Taille de page|
|search|query|string|false|none|
|sortBy|query|string|false|Champ de tri (selon ressource)|
|sortOrder|query|string|false|Ordre de tri|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sortOrder|asc|
|sortOrder|desc|

> Example responses

> 200 Response

```json
{
  "departments": [
    {
      "id": "string",
      "organizationId": "string",
      "name": "string",
      "code": "string",
      "description": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 123,
    "pages": 13
  }
}
```

<h3 id="get__organizations_{id}_departments-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Départements de l'organisation|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Organisation introuvable|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__organizations_{id}_departments-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» departments|[[Department](#schemadepartment)]|false|none|none|
|»» id|string|false|none|none|
|»» organizationId|string|false|none|none|
|»» name|string|false|none|none|
|»» code|string|false|none|none|
|»» description|string|false|none|none|
|» pagination|[Pagination](#schemapagination)|false|none|none|
|»» page|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» total|integer|false|none|none|
|»» pages|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-payments">Payments</h1>

Gestion des paiements

## get__payments

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/payments \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/payments HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/payments',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/payments',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/payments', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/payments', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/payments");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/payments", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /payments`

*Liste des paiements*

<h3 id="get__payments-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__payments

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/payments \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/payments HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/payments',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/payments',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/payments', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/payments', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/payments");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/payments", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /payments`

*Crée un nouveau paiement*

<h3 id="post__payments-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__payments_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/payments/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/payments/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/payments/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/payments/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/payments/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/payments/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/payments/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/payments/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /payments/{id}`

*Récupère un paiement par ID*

<h3 id="get__payments_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__payments_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:5000/payments/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:5000/payments/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/payments/{id}',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:5000/payments/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:5000/payments/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:5000/payments/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/payments/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:5000/payments/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /payments/{id}`

*Met à jour un paiement*

<h3 id="put__payments_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__payments_{id}_status

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/payments/{id}/status \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/payments/{id}/status HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/payments/{id}/status',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/payments/{id}/status',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/payments/{id}/status', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/payments/{id}/status', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/payments/{id}/status");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/payments/{id}/status", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /payments/{id}/status`

*Met à jour le statut d'un paiement*

<h3 id="patch__payments_{id}_status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__payments_stats

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/payments/stats \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/payments/stats HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/payments/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/payments/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/payments/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/payments/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/payments/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/payments/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /payments/stats`

*Statistiques des paiements*

<h3 id="get__payments_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-transactions">Transactions</h1>

Gestion des transactions

## get__transactions

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/transactions \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/transactions HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/transactions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/transactions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/transactions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/transactions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/transactions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/transactions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /transactions`

*Liste des transactions*

<h3 id="get__transactions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__transactions

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/transactions \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/transactions HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/transactions',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/transactions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/transactions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/transactions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/transactions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/transactions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /transactions`

*Crée une nouvelle transaction*

<h3 id="post__transactions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__transactions_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/transactions/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/transactions/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/transactions/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/transactions/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/transactions/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/transactions/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/transactions/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/transactions/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /transactions/{id}`

*Récupère une transaction par ID*

<h3 id="get__transactions_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__transactions_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/transactions/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/transactions/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/transactions/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/transactions/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/transactions/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/transactions/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/transactions/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/transactions/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /transactions/{id}`

*Archive une transaction*

<h3 id="delete__transactions_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__transactions_{id}_statut

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/transactions/{id}/statut \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/transactions/{id}/statut HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/transactions/{id}/statut',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/transactions/{id}/statut',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/transactions/{id}/statut', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/transactions/{id}/statut', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/transactions/{id}/statut");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/transactions/{id}/statut", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /transactions/{id}/statut`

*Met à jour le statut d'une transaction*

<h3 id="patch__transactions_{id}_statut-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__transactions_{id}_restore

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/transactions/{id}/restore \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/transactions/{id}/restore HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/transactions/{id}/restore',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/transactions/{id}/restore',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/transactions/{id}/restore', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/transactions/{id}/restore', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/transactions/{id}/restore");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/transactions/{id}/restore", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /transactions/{id}/restore`

*Restaure une transaction archivée*

<h3 id="patch__transactions_{id}_restore-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__transactions_stats

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/transactions/stats \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/transactions/stats HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/transactions/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/transactions/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/transactions/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/transactions/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/transactions/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/transactions/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /transactions/stats`

*Statistiques des transactions*

<h3 id="get__transactions_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="applyons-backoffice-api-users">Users</h1>

Gestion des utilisateurs

## get__users

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/users \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/users HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/users',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/users',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/users', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/users', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/users");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/users", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /users`

*Liste des utilisateurs*

<h3 id="get__users-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer|false|Numéro de page (1-n)|
|limit|query|integer|false|Taille de page|
|sortBy|query|string|false|Champ de tri (selon ressource)|
|sortOrder|query|string|false|Ordre de tri|
|search|query|string|false|Terme de recherche (email, username, phone, country)|
|role|query|string|false|Filtrer par rôle|
|enabled|query|boolean|false|Filtrer par statut (activé/désactivé)|
|organizationId|query|string|false|Filtrer par ID d'organisation|
|permissionKey|query|string|false|Filtrer par clé de permission|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sortOrder|asc|
|sortOrder|desc|
|role|DEMANDEUR|
|role|INSTITUT|
|role|TRADUCTEUR|
|role|SUPERVISEUR|
|role|ADMIN|

<h3 id="get__users-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__users

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:5000/users \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:5000/users HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/users',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:5000/users',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:5000/users', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:5000/users', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/users");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:5000/users", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /users`

*Crée un nouvel utilisateur*

<h3 id="post__users-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__users_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/users/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/users/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/users/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/users/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/users/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/users/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/users/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/users/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /users/{id}`

*Récupère un utilisateur par ID*

<h3 id="get__users_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__users_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:5000/users/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:5000/users/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/users/{id}',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:5000/users/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:5000/users/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:5000/users/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/users/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:5000/users/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /users/{id}`

*Met à jour un utilisateur*

<h3 id="put__users_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__users_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:5000/users/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:5000/users/{id} HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/users/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:5000/users/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:5000/users/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:5000/users/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/users/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:5000/users/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /users/{id}`

*Archive un utilisateur*

<h3 id="delete__users_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__users_{id}_password

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/users/{id}/password \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/users/{id}/password HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/users/{id}/password',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/users/{id}/password',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/users/{id}/password', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/users/{id}/password', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/users/{id}/password");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/users/{id}/password", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /users/{id}/password`

*Réinitialise le mot de passe d'un utilisateur*

<h3 id="patch__users_{id}_password-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__users_{id}_restore

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/users/{id}/restore \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/users/{id}/restore HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/users/{id}/restore',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/users/{id}/restore',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/users/{id}/restore', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/users/{id}/restore', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/users/{id}/restore");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/users/{id}/restore", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /users/{id}/restore`

*Restaure un utilisateur archivé*

<h3 id="patch__users_{id}_restore-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch__users_{id}_permissions

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:5000/users/{id}/permissions \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:5000/users/{id}/permissions HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/users/{id}/permissions',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:5000/users/{id}/permissions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:5000/users/{id}/permissions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:5000/users/{id}/permissions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/users/{id}/permissions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:5000/users/{id}/permissions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /users/{id}/permissions`

*Met à jour les permissions d'un utilisateur*

<h3 id="patch__users_{id}_permissions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__users_search

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:5000/users/search \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:5000/users/search HTTP/1.1
Host: localhost:5000

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:5000/users/search',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:5000/users/search',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:5000/users/search', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:5000/users/search', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:5000/users/search");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:5000/users/search", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /users/search`

*Recherche des utilisateurs*

<h3 id="get__users_search-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

# Schemas

<h2 id="tocS_Pagination">Pagination</h2>
<!-- backwards compatibility -->
<a id="schemapagination"></a>
<a id="schema_Pagination"></a>
<a id="tocSpagination"></a>
<a id="tocspagination"></a>

```json
{
  "page": 1,
  "limit": 10,
  "total": 123,
  "pages": 13
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|page|integer|false|none|none|
|limit|integer|false|none|none|
|total|integer|false|none|none|
|pages|integer|false|none|none|

<h2 id="tocS_Error">Error</h2>
<!-- backwards compatibility -->
<a id="schemaerror"></a>
<a id="schema_Error"></a>
<a id="tocSerror"></a>
<a id="tocserror"></a>

```json
{
  "message": "string",
  "code": "string",
  "errors": [
    {
      "msg": "string",
      "param": "string",
      "location": "string"
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|message|string|false|none|none|
|code|string|false|none|none|
|errors|[object]|false|none|none|
|» msg|string|false|none|none|
|» param|string|false|none|none|
|» location|string|false|none|none|

<h2 id="tocS_MessageOnly">MessageOnly</h2>
<!-- backwards compatibility -->
<a id="schemamessageonly"></a>
<a id="schema_MessageOnly"></a>
<a id="tocSmessageonly"></a>
<a id="tocsmessageonly"></a>

```json
{
  "message": "Opération effectuée"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|message|string|false|none|none|

<h2 id="tocS_UserLite">UserLite</h2>
<!-- backwards compatibility -->
<a id="schemauserlite"></a>
<a id="schema_UserLite"></a>
<a id="tocSuserlite"></a>
<a id="tocsuserlite"></a>

```json
{
  "id": "string",
  "email": "user@example.com",
  "username": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|email|string(email)|false|none|none|
|username|string|false|none|none|

<h2 id="tocS_OrganizationLite">OrganizationLite</h2>
<!-- backwards compatibility -->
<a id="schemaorganizationlite"></a>
<a id="schema_OrganizationLite"></a>
<a id="tocSorganizationlite"></a>
<a id="tocsorganizationlite"></a>

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "type": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|name|string|false|none|none|
|slug|string|false|none|none|
|type|string¦null|false|none|none|

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "id": "string",
  "email": "user@example.com",
  "username": "string",
  "role": "DEMANDEUR",
  "enabled": true,
  "phone": "string",
  "avatar": "string",
  "country": "string",
  "organization": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "type": "string"
  },
  "permissions": [
    {
      "key": "string",
      "name": "string"
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|email|string(email)|false|none|none|
|username|string|false|none|none|
|role|string|false|none|none|
|enabled|boolean|false|none|none|
|phone|string|false|none|none|
|avatar|string|false|none|none|
|country|string|false|none|none|
|organization|object|false|none|none|
|» id|string|false|none|none|
|» name|string|false|none|none|
|» slug|string|false|none|none|
|» type|string|false|none|none|
|permissions|[object]|false|none|none|
|» key|string|false|none|none|
|» name|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|role|DEMANDEUR|
|role|INSTITUT|
|role|TRADUCTEUR|
|role|SUPERVISEUR|
|role|ADMIN|

<h2 id="tocS_RegisterUser">RegisterUser</h2>
<!-- backwards compatibility -->
<a id="schemaregisteruser"></a>
<a id="schema_RegisterUser"></a>
<a id="tocSregisteruser"></a>
<a id="tocsregisteruser"></a>

```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "role": "DEMANDEUR",
  "organizationId": "string",
  "permissions": [
    "string"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|username|string|false|none|none|
|email|string(email)|true|none|none|
|password|string|true|none|none|
|role|string|false|none|none|
|organizationId|string|false|none|none|
|permissions|[string]|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|role|DEMANDEUR|
|role|INSTITUT|
|role|TRADUCTEUR|
|role|SUPERVISEUR|

<h2 id="tocS_UpdateProfile">UpdateProfile</h2>
<!-- backwards compatibility -->
<a id="schemaupdateprofile"></a>
<a id="schema_UpdateProfile"></a>
<a id="tocSupdateprofile"></a>
<a id="tocsupdateprofile"></a>

```json
{
  "username": "string",
  "phone": "string",
  "adress": "string",
  "avatar": "string",
  "country": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|username|string|false|none|none|
|phone|string|false|none|none|
|adress|string|false|none|none|
|avatar|string|false|none|none|
|country|string|false|none|none|

<h2 id="tocS_CreateUser">CreateUser</h2>
<!-- backwards compatibility -->
<a id="schemacreateuser"></a>
<a id="schema_CreateUser"></a>
<a id="tocScreateuser"></a>
<a id="tocscreateuser"></a>

```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "role": "DEMANDEUR",
  "organizationId": "string",
  "permissions": [
    "string"
  ],
  "enabled": true
}

```

### Properties

allOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[RegisterUser](#schemaregisteruser)|false|none|none|

and

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|
|» enabled|boolean|false|none|none|

<h2 id="tocS_UpdateUser">UpdateUser</h2>
<!-- backwards compatibility -->
<a id="schemaupdateuser"></a>
<a id="schema_UpdateUser"></a>
<a id="tocSupdateuser"></a>
<a id="tocsupdateuser"></a>

```json
{
  "username": "string",
  "email": "user@example.com",
  "role": "string",
  "enabled": true,
  "organizationId": "string",
  "permissions": [
    "string"
  ],
  "phone": "string",
  "adress": "string",
  "country": "string",
  "gender": "MALE"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|username|string|false|none|none|
|email|string(email)|false|none|none|
|role|string|false|none|none|
|enabled|boolean|false|none|none|
|organizationId|string|false|none|none|
|permissions|[string]|false|none|none|
|phone|string|false|none|none|
|adress|string|false|none|none|
|country|string|false|none|none|
|gender|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|MALE|
|gender|FEMALE|
|gender|OTHER|

<h2 id="tocS_Organization">Organization</h2>
<!-- backwards compatibility -->
<a id="schemaorganization"></a>
<a id="schema_Organization"></a>
<a id="tocSorganization"></a>
<a id="tocsorganization"></a>

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "type": "string",
  "email": "user@example.com",
  "phone": "string",
  "address": "string",
  "website": "string",
  "country": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|name|string|false|none|none|
|slug|string|false|none|none|
|type|string|false|none|none|
|email|string(email)|false|none|none|
|phone|string|false|none|none|
|address|string|false|none|none|
|website|string|false|none|none|
|country|string|false|none|none|

<h2 id="tocS_Department">Department</h2>
<!-- backwards compatibility -->
<a id="schemadepartment"></a>
<a id="schema_Department"></a>
<a id="tocSdepartment"></a>
<a id="tocsdepartment"></a>

```json
{
  "id": "string",
  "organizationId": "string",
  "name": "string",
  "code": "string",
  "description": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|organizationId|string|false|none|none|
|name|string|false|none|none|
|code|string|false|none|none|
|description|string|false|none|none|

<h2 id="tocS_Filiere">Filiere</h2>
<!-- backwards compatibility -->
<a id="schemafiliere"></a>
<a id="schema_Filiere"></a>
<a id="tocSfiliere"></a>
<a id="tocsfiliere"></a>

```json
{
  "id": "string",
  "departmentId": "string",
  "name": "string",
  "code": "string",
  "description": "string",
  "level": "string",
  "department": {
    "id": "string",
    "organizationId": "string",
    "name": "string",
    "code": "string",
    "description": "string"
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|departmentId|string|false|none|none|
|name|string|false|none|none|
|code|string|false|none|none|
|description|string|false|none|none|
|level|string|false|none|none|
|department|[Department](#schemadepartment)|false|none|none|

<h2 id="tocS_Demande">Demande</h2>
<!-- backwards compatibility -->
<a id="schemademande"></a>
<a id="schema_Demande"></a>
<a id="tocSdemande"></a>
<a id="tocsdemande"></a>

```json
{
  "id": "string",
  "code": "string",
  "dateDemande": "2019-08-24T14:15:22Z",
  "isDeleted": true,
  "status": "string",
  "user": {
    "id": "string",
    "email": "user@example.com",
    "username": "string"
  },
  "targetOrg": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "type": "string"
  },
  "assignedOrg": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "type": "string"
  },
  "meta": {
    "serie": "string",
    "niveau": "string",
    "mention": "string",
    "annee": "string",
    "countryOfSchool": "string",
    "secondarySchoolName": "string",
    "graduationDate": "2019-08-24T14:15:22Z"
  },
  "documentsCount": 0,
  "transaction": {
    "id": "string",
    "demandePartageId": "string",
    "montant": 0,
    "typePaiement": "MOBILE_MONEY",
    "statut": "PENDING",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|code|string¦null|false|none|none|
|dateDemande|string(date-time)|false|none|none|
|isDeleted|boolean|false|none|none|
|status|string¦null|false|none|none|
|user|[UserLite](#schemauserlite)|false|none|none|
|targetOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|assignedOrg|[OrganizationLite](#schemaorganizationlite)|false|none|none|
|meta|object|false|none|none|
|» serie|string¦null|false|none|none|
|» niveau|string¦null|false|none|none|
|» mention|string¦null|false|none|none|
|» annee|string¦null|false|none|none|
|» countryOfSchool|string¦null|false|none|none|
|» secondarySchoolName|string¦null|false|none|none|
|» graduationDate|string(date-time)¦null|false|none|none|
|documentsCount|integer|false|none|none|
|transaction|[Transaction](#schematransaction)|false|none|none|

<h2 id="tocS_CreateDemande">CreateDemande</h2>
<!-- backwards compatibility -->
<a id="schemacreatedemande"></a>
<a id="schema_CreateDemande"></a>
<a id="tocScreatedemande"></a>
<a id="tocscreatedemande"></a>

```json
{
  "targetOrgId": "string",
  "assignedOrgId": "string",
  "userId": "string",
  "serie": "string",
  "niveau": "string",
  "mention": "string",
  "annee": "string",
  "countryOfSchool": "string",
  "secondarySchoolName": "string",
  "graduationDate": "2019-08-24",
  "periode": "string",
  "year": "string",
  "status": "string",
  "observation": "string",
  "statusPayment": "string",
  "dob": "2019-08-24",
  "citizenship": "string",
  "passport": "string",
  "isEnglishFirstLanguage": true,
  "englishProficiencyTests": {},
  "testScores": "string",
  "gradingScale": "string",
  "gpa": "string",
  "examsTaken": {},
  "intendedMajor": "string",
  "extracurricularActivities": "string",
  "honorsOrAwards": "string",
  "parentGuardianName": "string",
  "occupation": "string",
  "educationLevel": "string",
  "willApplyForFinancialAid": true,
  "hasExternalSponsorship": true,
  "visaType": "string",
  "hasPreviouslyStudiedInUS": true,
  "personalStatement": "string",
  "optionalEssay": "string",
  "applicationRound": "string",
  "howDidYouHearAboutUs": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|targetOrgId|string|true|none|none|
|assignedOrgId|string¦null|false|none|none|
|userId|string¦null|false|none|none|
|serie|string¦null|false|none|none|
|niveau|string¦null|false|none|none|
|mention|string¦null|false|none|none|
|annee|string¦null|false|none|none|
|countryOfSchool|string¦null|false|none|none|
|secondarySchoolName|string¦null|false|none|none|
|graduationDate|string(date)¦null|false|none|none|
|periode|string¦null|false|none|none|
|year|string¦null|false|none|none|
|status|string¦null|false|none|none|
|observation|string¦null|false|none|none|
|statusPayment|string¦null|false|none|none|
|dob|string(date)¦null|false|none|none|
|citizenship|string¦null|false|none|none|
|passport|string¦null|false|none|none|
|isEnglishFirstLanguage|boolean¦null|false|none|none|
|englishProficiencyTests|object¦null|false|none|none|
|testScores|string¦null|false|none|none|
|gradingScale|string¦null|false|none|none|
|gpa|string¦null|false|none|none|
|examsTaken|object¦null|false|none|none|
|intendedMajor|string¦null|false|none|none|
|extracurricularActivities|string¦null|false|none|none|
|honorsOrAwards|string¦null|false|none|none|
|parentGuardianName|string¦null|false|none|none|
|occupation|string¦null|false|none|none|
|educationLevel|string¦null|false|none|none|
|willApplyForFinancialAid|boolean¦null|false|none|none|
|hasExternalSponsorship|boolean¦null|false|none|none|
|visaType|string¦null|false|none|none|
|hasPreviouslyStudiedInUS|boolean¦null|false|none|none|
|personalStatement|string¦null|false|none|none|
|optionalEssay|string¦null|false|none|none|
|applicationRound|string¦null|false|none|none|
|howDidYouHearAboutUs|string¦null|false|none|none|

<h2 id="tocS_UpdateDemande">UpdateDemande</h2>
<!-- backwards compatibility -->
<a id="schemaupdatedemande"></a>
<a id="schema_UpdateDemande"></a>
<a id="tocSupdatedemande"></a>
<a id="tocsupdatedemande"></a>

```json
{
  "assignedOrgId": "string",
  "serie": "string",
  "niveau": "string",
  "mention": "string",
  "annee": "string",
  "countryOfSchool": "string",
  "secondarySchoolName": "string",
  "graduationDate": "2019-08-24",
  "periode": "string",
  "year": "string",
  "status": "string",
  "observation": "string",
  "statusPayment": "string",
  "dob": "2019-08-24",
  "citizenship": "string",
  "passport": "string",
  "isEnglishFirstLanguage": true,
  "englishProficiencyTests": {},
  "testScores": "string",
  "gradingScale": "string",
  "gpa": "string",
  "examsTaken": {},
  "intendedMajor": "string",
  "extracurricularActivities": "string",
  "honorsOrAwards": "string",
  "parentGuardianName": "string",
  "occupation": "string",
  "educationLevel": "string",
  "willApplyForFinancialAid": true,
  "hasExternalSponsorship": true,
  "visaType": "string",
  "hasPreviouslyStudiedInUS": true,
  "personalStatement": "string",
  "optionalEssay": "string",
  "applicationRound": "string",
  "howDidYouHearAboutUs": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|assignedOrgId|string¦null|false|none|none|
|serie|string¦null|false|none|none|
|niveau|string¦null|false|none|none|
|mention|string¦null|false|none|none|
|annee|string¦null|false|none|none|
|countryOfSchool|string¦null|false|none|none|
|secondarySchoolName|string¦null|false|none|none|
|graduationDate|string(date)¦null|false|none|none|
|periode|string¦null|false|none|none|
|year|string¦null|false|none|none|
|status|string¦null|false|none|none|
|observation|string¦null|false|none|none|
|statusPayment|string¦null|false|none|none|
|dob|string(date)¦null|false|none|none|
|citizenship|string¦null|false|none|none|
|passport|string¦null|false|none|none|
|isEnglishFirstLanguage|boolean¦null|false|none|none|
|englishProficiencyTests|object¦null|false|none|none|
|testScores|string¦null|false|none|none|
|gradingScale|string¦null|false|none|none|
|gpa|string¦null|false|none|none|
|examsTaken|object¦null|false|none|none|
|intendedMajor|string¦null|false|none|none|
|extracurricularActivities|string¦null|false|none|none|
|honorsOrAwards|string¦null|false|none|none|
|parentGuardianName|string¦null|false|none|none|
|occupation|string¦null|false|none|none|
|educationLevel|string¦null|false|none|none|
|willApplyForFinancialAid|boolean¦null|false|none|none|
|hasExternalSponsorship|boolean¦null|false|none|none|
|visaType|string¦null|false|none|none|
|hasPreviouslyStudiedInUS|boolean¦null|false|none|none|
|personalStatement|string¦null|false|none|none|
|optionalEssay|string¦null|false|none|none|
|applicationRound|string¦null|false|none|none|
|howDidYouHearAboutUs|string¦null|false|none|none|

<h2 id="tocS_Document">Document</h2>
<!-- backwards compatibility -->
<a id="schemadocument"></a>
<a id="schema_Document"></a>
<a id="tocSdocument"></a>
<a id="tocsdocument"></a>

```json
{
  "id": "string",
  "demandePartageId": "string",
  "ownerOrgId": "string",
  "codeAdn": "string",
  "estTraduit": true,
  "aDocument": true,
  "hasOriginal": true,
  "hasTraduit": true,
  "isEncrypted": true,
  "urlOriginal": "http://example.com",
  "urlTraduit": "http://example.com",
  "urlChiffre": "http://example.com",
  "blockchainHash": "string",
  "encryptedBy": "string",
  "encryptedAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|demandePartageId|string|false|none|none|
|ownerOrgId|string|false|none|none|
|codeAdn|string¦null|false|none|none|
|estTraduit|boolean|false|none|none|
|aDocument|boolean|false|none|none|
|hasOriginal|boolean¦null|false|none|none|
|hasTraduit|boolean¦null|false|none|none|
|isEncrypted|boolean¦null|false|none|none|
|urlOriginal|string(uri)¦null|false|none|none|
|urlTraduit|string(uri)¦null|false|none|none|
|urlChiffre|string(uri)¦null|false|none|none|
|blockchainHash|string¦null|false|none|none|
|encryptedBy|string¦null|false|none|none|
|encryptedAt|string(date-time)¦null|false|none|none|
|createdAt|string(date-time)¦null|false|none|none|

<h2 id="tocS_Transaction">Transaction</h2>
<!-- backwards compatibility -->
<a id="schematransaction"></a>
<a id="schema_Transaction"></a>
<a id="tocStransaction"></a>
<a id="tocstransaction"></a>

```json
{
  "id": "string",
  "demandePartageId": "string",
  "montant": 0,
  "typePaiement": "MOBILE_MONEY",
  "statut": "PENDING",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|demandePartageId|string|false|none|none|
|montant|number|false|none|none|
|typePaiement|string|false|none|none|
|statut|string|false|none|none|
|createdAt|string(date-time)¦null|false|none|none|
|updatedAt|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|typePaiement|MOBILE_MONEY|
|typePaiement|BANK_TRANSFER|
|typePaiement|CARD|
|typePaiement|CASH|
|statut|PENDING|
|statut|SUCCESS|
|statut|FAILED|
|statut|CANCELED|

<h2 id="tocS_Payment">Payment</h2>
<!-- backwards compatibility -->
<a id="schemapayment"></a>
<a id="schema_Payment"></a>
<a id="tocSpayment"></a>
<a id="tocspayment"></a>

```json
{
  "id": "string",
  "provider": "string",
  "status": "INITIATED",
  "amount": 0,
  "currency": "string",
  "paymentType": "MOBILE_MONEY",
  "providerRef": "string",
  "paymentInfo": {},
  "demandePartageId": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|provider|string|false|none|none|
|status|string|false|none|none|
|amount|number|false|none|none|
|currency|string|false|none|none|
|paymentType|string|false|none|none|
|providerRef|string¦null|false|none|none|
|paymentInfo|object¦null|false|none|none|
|demandePartageId|string¦null|false|none|none|
|createdAt|string(date-time)¦null|false|none|none|
|updatedAt|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|INITIATED|
|status|REQUIRES_ACTION|
|status|AUTHORIZED|
|status|CAPTURED|
|status|CANCELED|
|status|FAILED|
|paymentType|MOBILE_MONEY|
|paymentType|BANK_TRANSFER|
|paymentType|CARD|
|paymentType|CASH|

<h2 id="tocS_Abonnement">Abonnement</h2>
<!-- backwards compatibility -->
<a id="schemaabonnement"></a>
<a id="schema_Abonnement"></a>
<a id="tocSabonnement"></a>
<a id="tocsabonnement"></a>

```json
{
  "id": "string",
  "organizationId": "string",
  "dateDebut": "2019-08-24",
  "dateExpiration": "2019-08-24",
  "montant": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|organizationId|string|false|none|none|
|dateDebut|string(date)|false|none|none|
|dateExpiration|string(date)|false|none|none|
|montant|number|false|none|none|

<h2 id="tocS_DemandeListResponse">DemandeListResponse</h2>
<!-- backwards compatibility -->
<a id="schemademandelistresponse"></a>
<a id="schema_DemandeListResponse"></a>
<a id="tocSdemandelistresponse"></a>
<a id="tocsdemandelistresponse"></a>

```json
{
  "demandes": [
    {
      "id": "string",
      "code": "string",
      "dateDemande": "2019-08-24T14:15:22Z",
      "isDeleted": true,
      "status": "string",
      "user": {
        "id": "string",
        "email": "user@example.com",
        "username": "string"
      },
      "targetOrg": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "type": "string"
      },
      "assignedOrg": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "type": "string"
      },
      "meta": {
        "serie": "string",
        "niveau": "string",
        "mention": "string",
        "annee": "string",
        "countryOfSchool": "string",
        "secondarySchoolName": "string",
        "graduationDate": "2019-08-24T14:15:22Z"
      },
      "documentsCount": 0,
      "transaction": {
        "id": "string",
        "demandePartageId": "string",
        "montant": 0,
        "typePaiement": "MOBILE_MONEY",
        "statut": "PENDING",
        "createdAt": "2019-08-24T14:15:22Z",
        "updatedAt": "2019-08-24T14:15:22Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 123,
    "pages": 13
  },
  "filters": {}
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|demandes|[[Demande](#schemademande)]|false|none|none|
|pagination|[Pagination](#schemapagination)|false|none|none|
|filters|object|false|none|none|

<h2 id="tocS_DemandeItemResponse">DemandeItemResponse</h2>
<!-- backwards compatibility -->
<a id="schemademandeitemresponse"></a>
<a id="schema_DemandeItemResponse"></a>
<a id="tocSdemandeitemresponse"></a>
<a id="tocsdemandeitemresponse"></a>

```json
{
  "demande": {
    "id": "string",
    "code": "string",
    "dateDemande": "2019-08-24T14:15:22Z",
    "isDeleted": true,
    "status": "string",
    "user": {
      "id": "string",
      "email": "user@example.com",
      "username": "string"
    },
    "targetOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "assignedOrg": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string"
    },
    "meta": {
      "serie": "string",
      "niveau": "string",
      "mention": "string",
      "annee": "string",
      "countryOfSchool": "string",
      "secondarySchoolName": "string",
      "graduationDate": "2019-08-24T14:15:22Z"
    },
    "documentsCount": 0,
    "transaction": {
      "id": "string",
      "demandePartageId": "string",
      "montant": 0,
      "typePaiement": "MOBILE_MONEY",
      "statut": "PENDING",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  },
  "documents": [
    {
      "id": "string",
      "demandePartageId": "string",
      "ownerOrgId": "string",
      "codeAdn": "string",
      "estTraduit": true,
      "aDocument": true,
      "hasOriginal": true,
      "hasTraduit": true,
      "isEncrypted": true,
      "urlOriginal": "http://example.com",
      "urlTraduit": "http://example.com",
      "urlChiffre": "http://example.com",
      "blockchainHash": "string",
      "encryptedBy": "string",
      "encryptedAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "transaction": {
    "id": "string",
    "demandePartageId": "string",
    "montant": 0,
    "typePaiement": "MOBILE_MONEY",
    "statut": "PENDING",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  },
  "payment": {
    "id": "string",
    "provider": "string",
    "status": "INITIATED",
    "amount": 0,
    "currency": "string",
    "paymentType": "MOBILE_MONEY",
    "providerRef": "string",
    "paymentInfo": {},
    "demandePartageId": "string",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|demande|[Demande](#schemademande)|false|none|none|
|documents|[[Document](#schemadocument)]|false|none|none|
|transaction|[Transaction](#schematransaction)|false|none|none|
|payment|[Payment](#schemapayment)|false|none|none|

<h2 id="tocS_ContactMessage">ContactMessage</h2>
<!-- backwards compatibility -->
<a id="schemacontactmessage"></a>
<a id="schema_ContactMessage"></a>
<a id="tocScontactmessage"></a>
<a id="tocscontactmessage"></a>

```json
{
  "id": "string",
  "name": "string",
  "email": "user@example.com",
  "subject": "string",
  "message": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|name|string|false|none|none|
|email|string(email)|false|none|none|
|subject|string¦null|false|none|none|
|message|string|false|none|none|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

<h2 id="tocS_Configuration">Configuration</h2>
<!-- backwards compatibility -->
<a id="schemaconfiguration"></a>
<a id="schema_Configuration"></a>
<a id="tocSconfiguration"></a>
<a id="tocsconfiguration"></a>

```json
{
  "id": "string",
  "key": "string",
  "value": "string",
  "jsonValue": {},
  "description": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|key|string|false|none|none|
|value|string¦null|false|none|none|
|jsonValue|object¦null|false|none|none|
|description|string¦null|false|none|none|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

<h2 id="tocS_UpsertConfiguration">UpsertConfiguration</h2>
<!-- backwards compatibility -->
<a id="schemaupsertconfiguration"></a>
<a id="schema_UpsertConfiguration"></a>
<a id="tocSupsertconfiguration"></a>
<a id="tocsupsertconfiguration"></a>

```json
{
  "key": "smtp.host",
  "value": "string",
  "jsonValue": {},
  "description": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|key|string|true|none|none|
|value|string¦null|false|none|none|
|jsonValue|object¦null|false|none|none|
|description|string¦null|false|none|none|

