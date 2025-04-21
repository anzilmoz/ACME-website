!(function () {
  var e = {
      604: function (e) {
        "use strict";
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                })(e);
        }
        e.exports = function () {
          for (var e, r, o = [], n = window, i = n; i; ) {
            try {
              if (i.frames.__tcfapiLocator) {
                e = i;
                break;
              }
            } catch (e) {}
            if (i === n.top) break;
            i = i.parent;
          }
          e ||
            ((function e() {
              var t = n.document,
                r = !!n.frames.__tcfapiLocator;
              if (!r)
                if (t.body) {
                  var o = t.createElement("iframe");
                  (o.style.cssText = "display:none"),
                    (o.name = "__tcfapiLocator"),
                    t.body.appendChild(o);
                } else setTimeout(e, 5);
              return !r;
            })(),
            (n.__tcfapi = function () {
              for (
                var e = arguments.length, t = new Array(e), n = 0;
                n < e;
                n++
              )
                t[n] = arguments[n];
              if (!t.length) return o;
              "setGdprApplies" === t[0]
                ? t.length > 3 &&
                  2 === parseInt(t[1], 10) &&
                  "boolean" == typeof t[3] &&
                  ((r = t[3]), "function" == typeof t[2] && t[2]("set", !0))
                : "ping" === t[0]
                ? "function" == typeof t[2] &&
                  t[2]({ gdprApplies: r, cmpLoaded: !1, cmpStatus: "stub" })
                : o.push(t);
            }),
            n.addEventListener(
              "message",
              function (e) {
                var r = "string" == typeof e.data,
                  o = {};
                if (r)
                  try {
                    o = JSON.parse(e.data);
                  } catch (e) {}
                else o = e.data;
                var n = "object" === t(o) && null !== o ? o.__tcfapiCall : null;
                n &&
                  window.__tcfapi(
                    n.command,
                    n.version,
                    function (t, o) {
                      var i = {
                        __tcfapiReturn: {
                          returnValue: t,
                          success: o,
                          callId: n.callId,
                        },
                      };
                      e &&
                        e.source &&
                        e.source.postMessage &&
                        e.source.postMessage(r ? JSON.stringify(i) : i, "*");
                    },
                    n.parameter
                  );
              },
              !1
            ));
        };
      },
      241: function () {
        "document" in window.self &&
          ((!("classList" in document.createElement("_")) ||
            (document.createElementNS &&
              !(
                "classList" in
                document.createElementNS("http://www.w3.org/2000/svg", "g")
              ))) &&
            (function (e) {
              "use strict";
              if ("Element" in e) {
                var t = "classList",
                  r = "prototype",
                  o = e.Element[r],
                  n = Object,
                  i =
                    String[r].trim ||
                    function () {
                      return this.replace(/^\s+|\s+$/g, "");
                    },
                  s =
                    Array[r].indexOf ||
                    function (e) {
                      for (var t = 0, r = this.length; t < r; t++)
                        if (t in this && this[t] === e) return t;
                      return -1;
                    },
                  a = function (e, t) {
                    (this.name = e),
                      (this.code = DOMException[e]),
                      (this.message = t);
                  },
                  c = function (e, t) {
                    if ("" === t)
                      throw new a(
                        "SYNTAX_ERR",
                        "An invalid or illegal string was specified"
                      );
                    if (/\s/.test(t))
                      throw new a(
                        "INVALID_CHARACTER_ERR",
                        "String contains an invalid character"
                      );
                    return s.call(e, t);
                  },
                  u = function (e) {
                    for (
                      var t = i.call(e.getAttribute("class") || ""),
                        r = t ? t.split(/\s+/) : [],
                        o = 0,
                        n = r.length;
                      o < n;
                      o++
                    )
                      this.push(r[o]);
                    this._updateClassName = function () {
                      e.setAttribute("class", this.toString());
                    };
                  },
                  l = (u[r] = []),
                  d = function () {
                    return new u(this);
                  };
                if (
                  ((a[r] = Error[r]),
                  (l.item = function (e) {
                    return this[e] || null;
                  }),
                  (l.contains = function (e) {
                    return -1 !== c(this, (e += ""));
                  }),
                  (l.add = function () {
                    var e,
                      t = arguments,
                      r = 0,
                      o = t.length,
                      n = !1;
                    do {
                      -1 === c(this, (e = t[r] + "")) &&
                        (this.push(e), (n = !0));
                    } while (++r < o);
                    n && this._updateClassName();
                  }),
                  (l.remove = function () {
                    var e,
                      t,
                      r = arguments,
                      o = 0,
                      n = r.length,
                      i = !1;
                    do {
                      for (t = c(this, (e = r[o] + "")); -1 !== t; )
                        this.splice(t, 1), (i = !0), (t = c(this, e));
                    } while (++o < n);
                    i && this._updateClassName();
                  }),
                  (l.toggle = function (e, t) {
                    e += "";
                    var r = this.contains(e),
                      o = r ? !0 !== t && "remove" : !1 !== t && "add";
                    return o && this[o](e), !0 === t || !1 === t ? t : !r;
                  }),
                  (l.toString = function () {
                    return this.join(" ");
                  }),
                  n.defineProperty)
                ) {
                  var f = { get: d, enumerable: !0, configurable: !0 };
                  try {
                    n.defineProperty(o, t, f);
                  } catch (e) {
                    (void 0 !== e.number && -2146823252 !== e.number) ||
                      ((f.enumerable = !1), n.defineProperty(o, t, f));
                  }
                } else n[r].__defineGetter__ && o.__defineGetter__(t, d);
              }
            })(window.self),
          (function () {
            "use strict";
            var e = document.createElement("_");
            if ((e.classList.add("c1", "c2"), !e.classList.contains("c2"))) {
              var t = function (e) {
                var t = DOMTokenList.prototype[e];
                DOMTokenList.prototype[e] = function (e) {
                  var r,
                    o = arguments.length;
                  for (r = 0; r < o; r++) (e = arguments[r]), t.call(this, e);
                };
              };
              t("add"), t("remove");
            }
            if ((e.classList.toggle("c3", !1), e.classList.contains("c3"))) {
              var r = DOMTokenList.prototype.toggle;
              DOMTokenList.prototype.toggle = function (e, t) {
                return 1 in arguments && !this.contains(e) == !t
                  ? t
                  : r.call(this, e);
              };
            }
            e = null;
          })());
      },
      810: function () {
        !(function () {
          if ("undefined" != typeof window)
            try {
              var e = new window.CustomEvent("test", { cancelable: !0 });
              if ((e.preventDefault(), !0 !== e.defaultPrevented))
                throw new Error("Could not prevent default");
            } catch (e) {
              var t = function (e, t) {
                var r, o;
                return (
                  ((t = t || {}).bubbles = !!t.bubbles),
                  (t.cancelable = !!t.cancelable),
                  (r = document.createEvent("CustomEvent")).initCustomEvent(
                    e,
                    t.bubbles,
                    t.cancelable,
                    t.detail
                  ),
                  (o = r.preventDefault),
                  (r.preventDefault = function () {
                    o.call(this);
                    try {
                      Object.defineProperty(this, "defaultPrevented", {
                        get: function () {
                          return !0;
                        },
                      });
                    } catch (e) {
                      this.defaultPrevented = !0;
                    }
                  }),
                  r
                );
              };
              (t.prototype = window.Event.prototype), (window.CustomEvent = t);
            }
        })();
      },
      237: function () {
        function e(t) {
          return (
            (e =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  }),
            e(t)
          );
        }
        var t = function (e) {
            return "string" == typeof e;
          },
          r = function (e) {
            return e instanceof Blob;
          };
        function o(e, o) {
          var n = this.event && this.event.type,
            i = "unload" === n || "beforeunload" === n,
            s =
              "XMLHttpRequest" in this
                ? new XMLHttpRequest()
                : new ActiveXObject("Microsoft.XMLHTTP");
          s.open("POST", e, !i),
            (s.withCredentials = !0),
            s.setRequestHeader("Accept", "*/*"),
            t(o)
              ? (s.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"),
                (s.responseType = "text"))
              : r(o) && o.type && s.setRequestHeader("Content-Type", o.type);
          try {
            s.send(o);
          } catch (e) {
            return !1;
          }
          return !0;
        }
        (function () {
          "navigator" in this || (this.navigator = {});
          "function" != typeof this.navigator.sendBeacon &&
            (this.navigator.sendBeacon = o.bind(this));
        }).call(
          "object" === ("undefined" == typeof window ? "undefined" : e(window))
            ? window
            : {}
        );
      },
      147: function (e, t, r) {
        "use strict";
        r.r(t),
          r.d(t, {
            DOMException: function () {
              return w;
            },
            Headers: function () {
              return l;
            },
            Request: function () {
              return m;
            },
            Response: function () {
              return _;
            },
            fetch: function () {
              return k;
            },
          });
        var o =
            ("undefined" != typeof globalThis && globalThis) ||
            ("undefined" != typeof self && self) ||
            (void 0 !== r.g && r.g) ||
            {},
          n = {
            searchParams: "URLSearchParams" in o,
            iterable: "Symbol" in o && "iterator" in Symbol,
            blob:
              "FileReader" in o &&
              "Blob" in o &&
              (function () {
                try {
                  return new Blob(), !0;
                } catch (e) {
                  return !1;
                }
              })(),
            formData: "FormData" in o,
            arrayBuffer: "ArrayBuffer" in o,
          };
        if (n.arrayBuffer)
          var i = [
              "[object Int8Array]",
              "[object Uint8Array]",
              "[object Uint8ClampedArray]",
              "[object Int16Array]",
              "[object Uint16Array]",
              "[object Int32Array]",
              "[object Uint32Array]",
              "[object Float32Array]",
              "[object Float64Array]",
            ],
            s =
              ArrayBuffer.isView ||
              function (e) {
                return e && i.indexOf(Object.prototype.toString.call(e)) > -1;
              };
        function a(e) {
          if (
            ("string" != typeof e && (e = String(e)),
            /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(e) || "" === e)
          )
            throw new TypeError(
              'Invalid character in header field name: "' + e + '"'
            );
          return e.toLowerCase();
        }
        function c(e) {
          return "string" != typeof e && (e = String(e)), e;
        }
        function u(e) {
          var t = {
            next: function () {
              var t = e.shift();
              return { done: void 0 === t, value: t };
            },
          };
          return (
            n.iterable &&
              (t[Symbol.iterator] = function () {
                return t;
              }),
            t
          );
        }
        function l(e) {
          (this.map = {}),
            e instanceof l
              ? e.forEach(function (e, t) {
                  this.append(t, e);
                }, this)
              : Array.isArray(e)
              ? e.forEach(function (e) {
                  if (2 != e.length)
                    throw new TypeError(
                      "Headers constructor: expected name/value pair to be length 2, found" +
                        e.length
                    );
                  this.append(e[0], e[1]);
                }, this)
              : e &&
                Object.getOwnPropertyNames(e).forEach(function (t) {
                  this.append(t, e[t]);
                }, this);
        }
        function d(e) {
          if (!e._noBody)
            return e.bodyUsed
              ? Promise.reject(new TypeError("Already read"))
              : void (e.bodyUsed = !0);
        }
        function f(e) {
          return new Promise(function (t, r) {
            (e.onload = function () {
              t(e.result);
            }),
              (e.onerror = function () {
                r(e.error);
              });
          });
        }
        function p(e) {
          var t = new FileReader(),
            r = f(t);
          return t.readAsArrayBuffer(e), r;
        }
        function y(e) {
          if (e.slice) return e.slice(0);
          var t = new Uint8Array(e.byteLength);
          return t.set(new Uint8Array(e)), t.buffer;
        }
        function h() {
          return (
            (this.bodyUsed = !1),
            (this._initBody = function (e) {
              var t;
              (this.bodyUsed = this.bodyUsed),
                (this._bodyInit = e),
                e
                  ? "string" == typeof e
                    ? (this._bodyText = e)
                    : n.blob && Blob.prototype.isPrototypeOf(e)
                    ? (this._bodyBlob = e)
                    : n.formData && FormData.prototype.isPrototypeOf(e)
                    ? (this._bodyFormData = e)
                    : n.searchParams &&
                      URLSearchParams.prototype.isPrototypeOf(e)
                    ? (this._bodyText = e.toString())
                    : n.arrayBuffer &&
                      n.blob &&
                      (t = e) &&
                      DataView.prototype.isPrototypeOf(t)
                    ? ((this._bodyArrayBuffer = y(e.buffer)),
                      (this._bodyInit = new Blob([this._bodyArrayBuffer])))
                    : n.arrayBuffer &&
                      (ArrayBuffer.prototype.isPrototypeOf(e) || s(e))
                    ? (this._bodyArrayBuffer = y(e))
                    : (this._bodyText = e = Object.prototype.toString.call(e))
                  : ((this._noBody = !0), (this._bodyText = "")),
                this.headers.get("content-type") ||
                  ("string" == typeof e
                    ? this.headers.set(
                        "content-type",
                        "text/plain;charset=UTF-8"
                      )
                    : this._bodyBlob && this._bodyBlob.type
                    ? this.headers.set("content-type", this._bodyBlob.type)
                    : n.searchParams &&
                      URLSearchParams.prototype.isPrototypeOf(e) &&
                      this.headers.set(
                        "content-type",
                        "application/x-www-form-urlencoded;charset=UTF-8"
                      ));
            }),
            n.blob &&
              (this.blob = function () {
                var e = d(this);
                if (e) return e;
                if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                if (this._bodyArrayBuffer)
                  return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                if (this._bodyFormData)
                  throw new Error("could not read FormData body as blob");
                return Promise.resolve(new Blob([this._bodyText]));
              }),
            (this.arrayBuffer = function () {
              if (this._bodyArrayBuffer) {
                var e = d(this);
                return (
                  e ||
                  (ArrayBuffer.isView(this._bodyArrayBuffer)
                    ? Promise.resolve(
                        this._bodyArrayBuffer.buffer.slice(
                          this._bodyArrayBuffer.byteOffset,
                          this._bodyArrayBuffer.byteOffset +
                            this._bodyArrayBuffer.byteLength
                        )
                      )
                    : Promise.resolve(this._bodyArrayBuffer))
                );
              }
              if (n.blob) return this.blob().then(p);
              throw new Error("could not read as ArrayBuffer");
            }),
            (this.text = function () {
              var e,
                t,
                r,
                o,
                n,
                i = d(this);
              if (i) return i;
              if (this._bodyBlob)
                return (
                  (e = this._bodyBlob),
                  (t = new FileReader()),
                  (r = f(t)),
                  (o = /charset=([A-Za-z0-9_-]+)/.exec(e.type)),
                  (n = o ? o[1] : "utf-8"),
                  t.readAsText(e, n),
                  r
                );
              if (this._bodyArrayBuffer)
                return Promise.resolve(
                  (function (e) {
                    for (
                      var t = new Uint8Array(e), r = new Array(t.length), o = 0;
                      o < t.length;
                      o++
                    )
                      r[o] = String.fromCharCode(t[o]);
                    return r.join("");
                  })(this._bodyArrayBuffer)
                );
              if (this._bodyFormData)
                throw new Error("could not read FormData body as text");
              return Promise.resolve(this._bodyText);
            }),
            n.formData &&
              (this.formData = function () {
                return this.text().then(g);
              }),
            (this.json = function () {
              return this.text().then(JSON.parse);
            }),
            this
          );
        }
        (l.prototype.append = function (e, t) {
          (e = a(e)), (t = c(t));
          var r = this.map[e];
          this.map[e] = r ? r + ", " + t : t;
        }),
          (l.prototype.delete = function (e) {
            delete this.map[a(e)];
          }),
          (l.prototype.get = function (e) {
            return (e = a(e)), this.has(e) ? this.map[e] : null;
          }),
          (l.prototype.has = function (e) {
            return this.map.hasOwnProperty(a(e));
          }),
          (l.prototype.set = function (e, t) {
            this.map[a(e)] = c(t);
          }),
          (l.prototype.forEach = function (e, t) {
            for (var r in this.map)
              this.map.hasOwnProperty(r) && e.call(t, this.map[r], r, this);
          }),
          (l.prototype.keys = function () {
            var e = [];
            return (
              this.forEach(function (t, r) {
                e.push(r);
              }),
              u(e)
            );
          }),
          (l.prototype.values = function () {
            var e = [];
            return (
              this.forEach(function (t) {
                e.push(t);
              }),
              u(e)
            );
          }),
          (l.prototype.entries = function () {
            var e = [];
            return (
              this.forEach(function (t, r) {
                e.push([r, t]);
              }),
              u(e)
            );
          }),
          n.iterable && (l.prototype[Symbol.iterator] = l.prototype.entries);
        var b = [
          "CONNECT",
          "DELETE",
          "GET",
          "HEAD",
          "OPTIONS",
          "PATCH",
          "POST",
          "PUT",
          "TRACE",
        ];
        function m(e, t) {
          if (!(this instanceof m))
            throw new TypeError(
              'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
            );
          var r,
            n,
            i = (t = t || {}).body;
          if (e instanceof m) {
            if (e.bodyUsed) throw new TypeError("Already read");
            (this.url = e.url),
              (this.credentials = e.credentials),
              t.headers || (this.headers = new l(e.headers)),
              (this.method = e.method),
              (this.mode = e.mode),
              (this.signal = e.signal),
              i ||
                null == e._bodyInit ||
                ((i = e._bodyInit), (e.bodyUsed = !0));
          } else this.url = String(e);
          if (
            ((this.credentials =
              t.credentials || this.credentials || "same-origin"),
            (!t.headers && this.headers) || (this.headers = new l(t.headers)),
            (this.method =
              ((r = t.method || this.method || "GET"),
              (n = r.toUpperCase()),
              b.indexOf(n) > -1 ? n : r)),
            (this.mode = t.mode || this.mode || null),
            (this.signal =
              t.signal ||
              this.signal ||
              (function () {
                if ("AbortController" in o) return new AbortController().signal;
              })()),
            (this.referrer = null),
            ("GET" === this.method || "HEAD" === this.method) && i)
          )
            throw new TypeError("Body not allowed for GET or HEAD requests");
          if (
            (this._initBody(i),
            !(
              ("GET" !== this.method && "HEAD" !== this.method) ||
              ("no-store" !== t.cache && "no-cache" !== t.cache)
            ))
          ) {
            var s = /([?&])_=[^&]*/;
            if (s.test(this.url))
              this.url = this.url.replace(s, "$1_=" + new Date().getTime());
            else {
              this.url +=
                (/\?/.test(this.url) ? "&" : "?") + "_=" + new Date().getTime();
            }
          }
        }
        function g(e) {
          var t = new FormData();
          return (
            e
              .trim()
              .split("&")
              .forEach(function (e) {
                if (e) {
                  var r = e.split("="),
                    o = r.shift().replace(/\+/g, " "),
                    n = r.join("=").replace(/\+/g, " ");
                  t.append(decodeURIComponent(o), decodeURIComponent(n));
                }
              }),
            t
          );
        }
        function _(e, t) {
          if (!(this instanceof _))
            throw new TypeError(
              'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
            );
          if (
            (t || (t = {}),
            (this.type = "default"),
            (this.status = void 0 === t.status ? 200 : t.status),
            this.status < 200 || this.status > 599)
          )
            throw new RangeError(
              "Failed to construct 'Response': The status provided (0) is outside the range [200, 599]."
            );
          (this.ok = this.status >= 200 && this.status < 300),
            (this.statusText =
              void 0 === t.statusText ? "" : "" + t.statusText),
            (this.headers = new l(t.headers)),
            (this.url = t.url || ""),
            this._initBody(e);
        }
        (m.prototype.clone = function () {
          return new m(this, { body: this._bodyInit });
        }),
          h.call(m.prototype),
          h.call(_.prototype),
          (_.prototype.clone = function () {
            return new _(this._bodyInit, {
              status: this.status,
              statusText: this.statusText,
              headers: new l(this.headers),
              url: this.url,
            });
          }),
          (_.error = function () {
            var e = new _(null, { status: 200, statusText: "" });
            return (e.ok = !1), (e.status = 0), (e.type = "error"), e;
          });
        var v = [301, 302, 303, 307, 308];
        _.redirect = function (e, t) {
          if (-1 === v.indexOf(t)) throw new RangeError("Invalid status code");
          return new _(null, { status: t, headers: { location: e } });
        };
        var w = o.DOMException;
        try {
          new w();
        } catch (e) {
          ((w = function (e, t) {
            (this.message = e), (this.name = t);
            var r = Error(e);
            this.stack = r.stack;
          }).prototype = Object.create(Error.prototype)),
            (w.prototype.constructor = w);
        }
        function k(e, t) {
          return new Promise(function (r, i) {
            var s = new m(e, t);
            if (s.signal && s.signal.aborted)
              return i(new w("Aborted", "AbortError"));
            var u = new XMLHttpRequest();
            function d() {
              u.abort();
            }
            if (
              ((u.onload = function () {
                var e,
                  t,
                  o = {
                    statusText: u.statusText,
                    headers:
                      ((e = u.getAllResponseHeaders() || ""),
                      (t = new l()),
                      e
                        .replace(/\r?\n[\t ]+/g, " ")
                        .split("\r")
                        .map(function (e) {
                          return 0 === e.indexOf("\n")
                            ? e.substr(1, e.length)
                            : e;
                        })
                        .forEach(function (e) {
                          var r = e.split(":"),
                            o = r.shift().trim();
                          if (o) {
                            var n = r.join(":").trim();
                            try {
                              t.append(o, n);
                            } catch (e) {
                              console.warn("Response " + e.message);
                            }
                          }
                        }),
                      t),
                  };
                0 === s.url.indexOf("file://") &&
                (u.status < 200 || u.status > 599)
                  ? (o.status = 200)
                  : (o.status = u.status),
                  (o.url =
                    "responseURL" in u
                      ? u.responseURL
                      : o.headers.get("X-Request-URL"));
                var n = "response" in u ? u.response : u.responseText;
                setTimeout(function () {
                  r(new _(n, o));
                }, 0);
              }),
              (u.onerror = function () {
                setTimeout(function () {
                  i(new TypeError("Network request failed"));
                }, 0);
              }),
              (u.ontimeout = function () {
                setTimeout(function () {
                  i(new TypeError("Network request timed out"));
                }, 0);
              }),
              (u.onabort = function () {
                setTimeout(function () {
                  i(new w("Aborted", "AbortError"));
                }, 0);
              }),
              u.open(
                s.method,
                (function (e) {
                  try {
                    return "" === e && o.location.href ? o.location.href : e;
                  } catch (t) {
                    return e;
                  }
                })(s.url),
                !0
              ),
              "include" === s.credentials
                ? (u.withCredentials = !0)
                : "omit" === s.credentials && (u.withCredentials = !1),
              "responseType" in u &&
                (n.blob
                  ? (u.responseType = "blob")
                  : n.arrayBuffer && (u.responseType = "arraybuffer")),
              t &&
                "object" == typeof t.headers &&
                !(
                  t.headers instanceof l ||
                  (o.Headers && t.headers instanceof o.Headers)
                ))
            ) {
              var f = [];
              Object.getOwnPropertyNames(t.headers).forEach(function (e) {
                f.push(a(e)), u.setRequestHeader(e, c(t.headers[e]));
              }),
                s.headers.forEach(function (e, t) {
                  -1 === f.indexOf(t) && u.setRequestHeader(t, e);
                });
            } else
              s.headers.forEach(function (e, t) {
                u.setRequestHeader(t, e);
              });
            s.signal &&
              (s.signal.addEventListener("abort", d),
              (u.onreadystatechange = function () {
                4 === u.readyState && s.signal.removeEventListener("abort", d);
              })),
              u.send(void 0 === s._bodyInit ? null : s._bodyInit);
          });
        }
        (k.polyfill = !0),
          o.fetch ||
            ((o.fetch = k), (o.Headers = l), (o.Request = m), (o.Response = _));
      },
    },
    t = {};
  function r(o) {
    var n = t[o];
    if (void 0 !== n) return n.exports;
    var i = (t[o] = { exports: {} });
    return e[o](i, i.exports, r), i.exports;
  }
  (r.d = function (e, t) {
    for (var o in t)
      r.o(t, o) &&
        !r.o(e, o) &&
        Object.defineProperty(e, o, { enumerable: !0, get: t[o] });
  }),
    (r.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" == typeof window) return window;
      }
    })()),
    (r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (r.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    r(147),
    r(810),
    r(241),
    r(237),
    Element.prototype.toggleAttribute ||
      (Element.prototype.toggleAttribute = function (e, t) {
        return (
          void 0 !== t && (t = !!t),
          this.hasAttribute(e)
            ? !!t || (this.removeAttribute(e), !1)
            : !1 !== t && (this.setAttribute(e, ""), !0)
        );
      }),
    Element.prototype.remove ||
      (Element.prototype.remove = function () {
        this.parentNode && this.parentNode.removeChild(this);
      }),
    (function () {
      if (
        !(function () {
          try {
            const e = {
                registeredDomain: "acme-website-livid.vercel.app",
                currentDomain: window.location.hostname,
              },
              t = e.registeredDomain.replace(/^www\./, ""),
              r = e.currentDomain.replace(/^www\./, "").split(".");
            for (let e = 0; e < r.length; e++) {
              if (r.slice(e).join(".") === t) return !0;
            }
            return !1;
          } catch (e) {
            return !1;
          }
        })()
      )
        throw new Error(
          "Looks like your website URL has changed. To ensure the proper functioning of your banner, update the registered URL on your CookieYes account (navigate to the Organizations & Sites page (https://app.cookieyes.com/settings/organizations-and-sites) and click the More button associated with your site). Then, reload this page to retry. If the issue persists, please contact us at https://www.cookieyes.com/support."
        );
      window.cookieyes = window.cookieyes || {};
      const e = window.cookieyes;
      function t(e, t, r) {
        return e.replace(t, r);
      }
      (e._ckyGetCookieMap = function () {
        const e = {};
        try {
          document.cookie.split(";").map((t) => {
            const [r, o] = t.split("=");
            r && (e[r.trim()] = o);
          });
        } catch (e) {}
        return e;
      }),
        (e._ckySetCookie = function (t, r) {
          let o =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : 0,
            n =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : e._ckyStore._rootDomain;
          const i = new Date(),
            s = 0 === o ? 0 : i.setTime(i.getTime() + 24 * o * 60 * 60 * 1e3);
          document.cookie = `${t}=${r}; expires=${new Date(
            s
          ).toUTCString()}; path=/;domain=${n}; SameSite=Strict; secure`;
        });
      const o = new Map([
        [".1.", "k"],
        [".2.", "l"],
        [".3.", "m"],
        [".4.", "n"],
        [".5.", "o"],
        [".6.", "p"],
        [".7.", "q"],
        [".8.", "r"],
        [".9.", "s"],
        [".10.", "t"],
        [".11.", "u"],
        ["00", "v"],
        ["k1", "a"],
        ["k2", "b"],
        ["k3", "c"],
        ["k4", "d"],
        ["k5", "e"],
        ["v.", "f"],
        ["12", "w"],
        ["13", "x"],
        ["14", "y"],
        ["15", "z"],
      ]);
      (e._ckyEncodeACString = function (r) {
        const n = r.split("~");
        if (!n[1] || r.length < 1200) return r;
        const i = n[1].split(".");
        return (
          (n[1] = i.reduce(
            (e, t, r) => (
              r > 0 && (e = `${e}.${Number(t) - Number(i[r - 1])}`), e
            ),
            i[0]
          )),
          (n[1] = Array.from(o.entries()).reduce((e, t) => {
            let [r, o] = t;
            return e.split(r).join(o);
          }, n[1])),
          (n[1] = `_${t(n[1], /(f[0-9]){3,}/g, function (t) {
            return e._ckyReplaceAll(`G${t}g`, "f", "");
          })}`),
          n.join("~")
        );
      }),
        (e._ckyDecodeACString = function (r) {
          const n = r.split("~");
          if (!n[1] || "_" !== n[1][0]) return r;
          n[1] = t(n[1].slice(1), /G([0-9]+)g/g, function (t) {
            return e._ckyReplaceAll(t.slice(1, -1), "", "f").slice(0, -1);
          });
          const i = new Map(Array.from(o, (e) => e.reverse()).reverse());
          n[1] = Array.from(i.entries()).reduce((e, t) => {
            let [r, o] = t;
            return e.split(r).join(o);
          }, n[1]);
          const s = n[1].split(".");
          return (
            (n[1] = s.reduce(
              (e, t, r) => (
                r > 0 && (e = `${e}.${Number(e.split(".").pop()) + Number(t)}`),
                e
              ),
              s[0]
            )),
            n.join("~")
          );
        }),
        (e._ckyRandomString = function (e) {
          let t =
            !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          const r =
              (t ? "0123456789" : "") +
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz",
            o = [];
          for (let t = 0; t < e; t++)
            o.push(r[Math.floor(Math.random() * r.length)]);
          return t ? btoa(o.join("")).replace(/\=+$/, "") : o.join("");
        }),
        (e._ckyIsCategoryToBeBlocked = function (t) {
          const r = e._ckyGetFromStore(t);
          return (
            "no" === r ||
            (!r &&
              e._ckyStore._categories.some(
                (e) => e.slug === t && !e.isNecessary
              ))
          );
        }),
        (e._ckyEscapeRegex = function (e) {
          return e.replace(/[.*+?^${}()[\]\\]/g, "\\$&");
        }),
        (e._ckyShouldBlockProvider = function (t) {
          const r = e._ckyStore._providersToBlock.find((r) => {
            let { url: o } = r;
            return new RegExp(e._ckyEscapeRegex(o)).test(t);
          });
          return r && r.categories.some((t) => e._ckyIsCategoryToBeBlocked(t));
        }),
        (e._ckyStartsWith = function (e, t) {
          return e.slice(0, t.length) === t;
        }),
        (e._ckyReplaceAll = function (t, r, o) {
          return t.replace(new RegExp(e._ckyEscapeRegex(r), "g"), o);
        }),
        (e._ckyStore = {
          _backupNodes: [],
          _categories: [
            {
              slug: "necessary",
              isNecessary: !0,
              defaultConsent: { gdpr: !0, ccpa: !0 },
              cookies: [],
            },
            {
              slug: "functional",
              isNecessary: !1,
              defaultConsent: { gdpr: !1, ccpa: !1 },
              cookies: [{ cookieID: "dummy_functional", domain: "dummy.com" }],
            },
            {
              slug: "analytics",
              isNecessary: !1,
              defaultConsent: { gdpr: !1, ccpa: !1 },
              cookies: [],
            },
            {
              slug: "performance",
              isNecessary: !1,
              defaultConsent: { gdpr: !1, ccpa: !1 },
              cookies: [],
            },
            {
              slug: "advertisement",
              isNecessary: !1,
              defaultConsent: { gdpr: !1, ccpa: !1 },
              cookies: [{ cookieID: "YSC", domain: "youtube.com" }],
            },
          ],
          _providersToBlock: [
            { url: "dummy.com", categories: ["functional"], fullPath: !1 },
            { url: "youtube.com", categories: ["advertisement"], fullPath: !1 },
          ],
          _rootDomain: "",
          _commonShortCodes: [
            {
              key: "cky_audit_table",
              content: {
                container: '<ul class="cky-cookie-des-table">[CONTENT]</ul>',
              },
              uiTag: "audit-table",
              type: "data",
              customTag: "",
              attributes: {},
            },
            {
              key: "cky_outside_audit_table",
              content: {
                container:
                  '<h3>[cky_preference_{{category_slug}}_title]</h3><div class="cky-category-des">[cky_preference_{{category_slug}}_description]</div><div class="cky-table-wrapper"><table class="cky-cookie-audit-table">[CONTENT]</tbody></table></div>',
              },
              uiTag: "video-placeholder",
              type: "data",
              customTag: "",
              attributes: {},
            },
            {
              key: "cky_audit_table_empty",
              content: {
                container:
                  '<p class="cky-empty-cookies-text">[cky_audit_table_empty_text]</p>',
              },
              uiTag: "audit-table",
              type: "data",
              customTag: "",
              attributes: {},
            },
          ],
          _resetConsentID: !1,
          _bannerAttached: !1,
          _gpcStatus: !!navigator.globalPrivacyControl,
        }),
        (e._ckyConsentStore = new Map()),
        (e._ckyGetFromStore = function (t) {
          return e._ckyConsentStore.get(t) || "";
        });
      let n = e._ckyGetCookieMap();
      e._ckySetInStore = function (t, r) {
        e._ckyConsentStore.set(t, r);
        const o = [];
        for (const [t, r] of e._ckyConsentStore) o.push(`${t}:${r}`);
        const n =
          e._ckyStore._bannerConfig && e._ckyStore._bannerConfig.scriptExpiry
            ? e._ckyStore._bannerConfig.scriptExpiry
            : 365;
        o.push("lastRenewedDate:1734509533000"),
          e._ckySetCookie("cookieyes-consent", o.join(","), n);
      };
      let i = (n["cookieyes-consent"] || "").split(",").reduce((e, t) => {
        if (!t) return e;
        const [r, o] = t.split(":");
        return (e[r] = o), e;
      }, {});
      i.consentid &&
        parseInt(i.lastRenewedDate || 0) < parseInt("1734509533000") &&
        (e._ckySetCookie("cookieyes-consent", "", 0),
        (n["cookieyes-consent"] = ""),
        e._ckySetCookie("euconsent", "", 0),
        (i = {})),
        ["consentid", "consent", "action"]
          .concat(
            e._ckyStore._categories.map((e) => {
              let { slug: t } = e;
              return t;
            })
          )
          .map((t) => e._ckyConsentStore.set(t, i[t] || ""));
      const s = (n.euconsent || "").split(",");
      Object.assign(e._ckyStore, {
        _prevTCString: s[0] || "",
        _prevGoogleACMString: e._ckyDecodeACString(s[1] || ""),
      }),
        (e._ckySendPageViewLog = function (t) {
          let r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
          try {
            const o = {
                consent_session_id: e._ckyGetFromStore("consentid"),
                banner_id: r,
              },
              n = new FormData();
            n.append("key", "e0cbb6f9f94af90997d1c988"),
              n.append("request_type", t),
              n.append("event_log_time", Math.round(Date.now() / 1e3)),
              n.append("payload", JSON.stringify(o)),
              navigator.sendBeacon("https://log.cookieyes.com/api/v1/log", n);
          } catch (e) {
            console.error(e);
          }
        });
      r(604)(),
        (function () {
          if (e._ckyGetFromStore("consentid")) return;
          const t = e._ckyRandomString(32);
          e._ckySetInStore("consentid", t), (e._ckyStore._resetConsentID = !0);
        })(),
        e._ckySendPageViewLog("banner_load");
      try {
        (e._ckyCreateElementBackup = document.createElement),
          (document.createElement = function () {
            for (var t = arguments.length, r = new Array(t), o = 0; o < t; o++)
              r[o] = arguments[o];
            const n = e._ckyCreateElementBackup.call(document, ...r);
            if ("script" !== n.nodeName.toLowerCase()) return n;
            const i = n.setAttribute.bind(n);
            return (
              Object.defineProperties(n, {
                src: {
                  get: function () {
                    return n.getAttribute("src") || "";
                  },
                  set: function (e) {
                    return (
                      c(n, e) && i("type", "javascript/blocked"),
                      i("src", e),
                      !0
                    );
                  },
                  configurable: !0,
                },
                type: {
                  get: function () {
                    return n.getAttribute("type") || "";
                  },
                  set: function (e) {
                    return (
                      (e = c(n) ? "javascript/blocked" : e), i("type", e), !0
                    );
                  },
                  configurable: !0,
                },
              }),
              (n.setAttribute = (e, t) => {
                if ("type" === e || "src" === e) return (n[e] = t);
                i(e, t),
                  "data-cookieyes" !== e ||
                    c(n) ||
                    i("type", "text/javascript");
              }),
              n
            );
          });
      } catch (e) {
        console.error(e);
      }
      function a(t) {
        if (t.nodeName)
          if (["script", "iframe"].includes(t.nodeName.toLowerCase()))
            !(function (t) {
              try {
                const r = e._ckyStartsWith(t.src, "//")
                    ? `${window.location.protocol}${t.src}`
                    : t.src,
                  { hostname: o, pathname: n } = new URL(r),
                  i = `${o}${n}`.replace(/^www./, "");
                if (
                  ((function (t, r) {
                    const o =
                      t.hasAttribute("data-cookieyes") &&
                      t.getAttribute("data-cookieyes");
                    if (!o) return;
                    const n = o.replace("cookieyes-", "");
                    for (const t of e._ckyStore._categories)
                      if (t.isNecessary && t.slug === n) return;
                    const i = e._ckyStore._providersToBlock.find((e) => {
                      let { url: t } = e;
                      return t === r;
                    });
                    i
                      ? i.isOverriden
                        ? i.categories.includes(n) || i.categories.push(n)
                        : ((i.categories = [n]), (i.isOverriden = !0))
                      : e._ckyStore._providersToBlock.push({
                          url: r,
                          categories: [n],
                          fullPath: !1,
                        });
                  })(t, i),
                  !e._ckyShouldBlockProvider(i))
                )
                  return;
                const s = e._ckyRandomString(8, !1);
                if ("iframe" === t.nodeName.toLowerCase())
                  !(function (e, t) {
                    let { offsetWidth: r, offsetHeight: o } = e;
                    if (0 === r || 0 === o) {
                      if (
                        (({ offsetWidth: r, offsetHeight: o } = (function (e) {
                          let { width: t, height: r } = e.style;
                          if (!t || !r) {
                            const o = window.getComputedStyle(e);
                            ({ width: t, height: r } = o);
                          }
                          if (!parseInt(t) || !parseInt(r))
                            return { offsetWidth: null, offsetHeight: null };
                          return { offsetWidth: t, offsetHeight: r };
                        })(e)),
                        !r || !o)
                      )
                        return;
                    } else (r = `${r}px`), (o = `${o}px`);
                    e.insertAdjacentHTML(
                      "afterend",
                      '<div class="video-placeholder-normal" data-cky-tag="video-placeholder" id="[UNIQUEID]"><p class="video-placeholder-text-normal" data-cky-tag="placeholder-title">[cky_video_placeholder_title]</p></div>'.replace(
                        "[UNIQUEID]",
                        t
                      )
                    );
                    const n = document.getElementById(t);
                    (n.style.width = r), (n.style.height = o);
                    const i = document.querySelector(
                      `#${t} .video-placeholder-text-normal`
                    );
                    i.style.display = "none";
                    const s = (function (e) {
                      const t = e.match(
                        /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
                      );
                      return (
                        !!(
                          t &&
                          Array.isArray(t) &&
                          t[2] &&
                          11 === t[2].length
                        ) && t[2]
                      );
                    })(e.src);
                    if (!s) return;
                    n.classList.replace(
                      "video-placeholder-normal",
                      "video-placeholder-youtube"
                    ),
                      (n.style.backgroundImage = `linear-gradient(rgba(76,72,72,.7),rgba(76,72,72,.7)),url('https://img.youtube.com/vi/${s}/maxresdefault.jpg')`),
                      i.classList.replace(
                        "video-placeholder-text-normal",
                        "video-placeholder-text-youtube"
                      );
                  })(t, s),
                    e._ckyStore._bannerAttached &&
                      e._ckySetPlaceHolder &&
                      e._ckySetPlaceHolder(s);
                else {
                  t.type = "javascript/blocked";
                  const e = function (r) {
                    r.preventDefault(),
                      t.removeEventListener("beforescriptexecute", e);
                  };
                  t.addEventListener("beforescriptexecute", e);
                }
                const a =
                  document.head.compareDocumentPosition(t) &
                  Node.DOCUMENT_POSITION_CONTAINED_BY
                    ? "head"
                    : "body";
                t.remove(),
                  e._ckyStore._backupNodes.push({
                    position: a,
                    node: t.cloneNode(),
                    uniqueID: s,
                  });
              } catch (e) {}
            })(t);
          else if (
            t.childElementCount > 0 &&
            "noscript" !== t.nodeName.toLowerCase()
          )
            for (const e of t.childNodes) a(e);
      }
      function c(t, r) {
        return (
          (t.hasAttribute("data-cookieyes") &&
            e._ckyIsCategoryToBeBlocked(
              t.getAttribute("data-cookieyes").replace("cookieyes-", "")
            )) ||
          e._ckyShouldBlockProvider(r || t.src)
        );
      }
      (e._nodeListObserver = new MutationObserver(function (e) {
        for (const { addedNodes: t } of e) for (const e of t) a(e);
      })),
        e._nodeListObserver.observe(document.documentElement, {
          childList: !0,
          subtree: !0,
        });
      const u = document.createElement("script");
      (u.src =
        "/js/cy-banner.js"),
        (u.async = !0),
        (u.id = "cookieyes-banner"),
        document.head.appendChild(u);
    })();
})();
