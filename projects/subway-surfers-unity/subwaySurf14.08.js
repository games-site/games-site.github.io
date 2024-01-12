var my4399UnityModule = function() {
    var _scriptDir = "undefined" != typeof document && document.currentScript ? document.currentScript.src : undefined;
    return function(UnityModule) {
        function CachedXMLHttpRequest() {
            function e() {
                var e = t.onload;
                return t.onload = function(i) {
                    var n = {
                        requestURL: r.requestURL,
                        responseURL: t.responseURL,
                        responseType: t.responseType,
                        lastModified: t.getResponseHeader("Last-Modified"),
                        eTag: t.getResponseHeader("ETag")
                    };
                    200 == t.status && (n.lastModified || n.eTag) ? (n.size = t.response.byteLength, CachedXMLHttpRequest.cache.put(r.requestURL, n, t.response, function(n) {
                        CachedXMLHttpRequest.log("'" + r.requestURL + "' downloaded successfully (" + t.response.byteLength + " bytes) " + (n ? "but not stored in indexedDB cache due to error." : "and stored in indexedDB cache.")), e && e(i)
                    })) : (304 == t.status && (r.override = !0, CachedXMLHttpRequest.log("'" + r.requestURL + "' served from indexedDB cache (" + r.response.byteLength + " bytes).")), e && e(i))
                }, t.send.apply(t, arguments)
            }

            function i(i, n, _) {
                var o = new CachedXMLHttpRequest.XMLHttpRequest;
                return o.open("HEAD", i.requestURL, !1), o.send(), r.override = i.lastModified ? i.lastModified == o.getResponseHeader("Last-Modified") : i.eTag && i.eTag == o.getResponseHeader("ETag"), r.override ? (CachedXMLHttpRequest.log("'" + r.requestURL + "' served from indexedDB cache (" + r.response.byteLength + " bytes)."), t.onload && t.onload(), undefined) : e.apply(n, _)
            }
            var n = this,
                t = new CachedXMLHttpRequest.XMLHttpRequest,
                r = {};
            Object.defineProperty(n, "open", {
                value: function(e, i, n) {
                    return r = {
                        method: e,
                        requestURL: CachedXMLHttpRequest.cache.requestURL(i),
                        async: n
                    }, t.open.apply(t, arguments)
                }
            }), Object.defineProperty(n, "setRequestHeader", {
                value: function() {
                    return r.customHeaders = !0, t.setRequestHeader.apply(t, arguments)
                }
            }), Object.defineProperty(n, "send", {
                value: function(_) {
                    var o = arguments,
                        a = r.requestURL.match("^https?://[^/]+/");
                    return !a || r.customHeaders || _ || "GET" != r.method || !r.async || "arraybuffer" != t.responseType ? t.send.apply(t, o) : (CachedXMLHttpRequest.cache.get(r.requestURL, function(_, l) {
                        return !_ && l && l.meta && l.meta.responseType == t.responseType ? (r.status = 200, r.statusText = "OK", r.response = l.response, r.responseURL = l.meta.responseURL, window.location.href.lastIndexOf(a[0], 0) ? i(l.meta, n, o) : (l.meta.lastModified ? t.setRequestHeader("If-Modified-Since", l.meta.lastModified) : l.meta.eTag && t.setRequestHeader("If-None-Match", l.meta.eTag), t.setRequestHeader("Cache-Control", "no-cache"), e.apply(n, o))) : e.apply(n, o)
                    }), undefined)
                }
            }), ["abort", "getAllResponseHeaders", "getResponseHeader", "overrideMimeType", "addEventListener"].forEach(function(e) {
                Object.defineProperty(n, e, {
                    value: function() {
                        return t[e].apply(t, arguments)
                    }
                })
            }), ["readyState", "response", "responseText", "responseType", "responseURL", "responseXML", "status", "statusText", "timeout", "upload", "withCredentials", "onloadstart", "onprogress", "onabort", "onerror", "onload", "ontimeout", "onloadend", "onreadystatechange"].forEach(function(e) {
                Object.defineProperty(n, e, {
                    get: function() {
                        return r.override && r[e] ? r[e] : t[e]
                    },
                    set: function(i) {
                        t[e] = i
                    }
                })
            })
        }

        function SendMessage(e, i, n) {
            if (undefined === n) Module.ccall("SendMessage", null, ["string", "string"], [e, i]);
            else if ("string" == typeof n) Module.ccall("SendMessageString", null, ["string", "string", "string"], [e, i, n]);
            else {
                if ("number" != typeof n) throw "" + n + " is does not have a type which is supported by SendMessage.";
                Module.ccall("SendMessageFloat", null, ["string", "string", "number"], [e, i, n])
            }
        }

        function locateFile(e) {
            return Module["locateFile"] ? Module["locateFile"](e, scriptDirectory) : scriptDirectory + e
        }

        function staticAlloc(e) {
            var i = STATICTOP;
            return STATICTOP = STATICTOP + e + 15 & -16, i
        }

        function dynamicAlloc(e) {
            var i, n = HEAP32[DYNAMICTOP_PTR >> 2],
                t = n + e + 15 & -16;
            return HEAP32[DYNAMICTOP_PTR >> 2] = t, t >= TOTAL_MEMORY && (i = enlargeMemory(), !i) ? (HEAP32[DYNAMICTOP_PTR >> 2] = n, 0) : n
        }

        function alignMemory(e, i) {
            i || (i = STACK_ALIGN);
            var n = e = Math.ceil(e / i) * i;
            return n
        }

        function getNativeTypeSize(e) {
            switch (e) {
                case "i1":
                case "i8":
                    return 1;
                case "i16":
                    return 2;
                case "i32":
                    return 4;
                case "i64":
                    return 8;
                case "float":
                    return 4;
                case "double":
                    return 8;
                default:
                    if ("*" === e[e.length - 1]) return 4;
                    if ("i" === e[0]) {
                        var i = parseInt(e.substr(1));
                        return assert(i % 8 === 0), i / 8
                    }
                    return 0
            }
        }

        function warnOnce(e) {
            warnOnce.shown || (warnOnce.shown = {}), warnOnce.shown[e] || (warnOnce.shown[e] = 1, err(e))
        }

        function addFunction(e, i) {
            var n, t = 0;
            for (n = t; t + 0 > n; n++)
                if (!functionPointers[n]) return functionPointers[n] = e, jsCallStartIndex + n;
            throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
        }

        function getFuncWrapper(e, i) {
            if (e) {
                assert(i), funcWrappers[i] || (funcWrappers[i] = {});
                var n = funcWrappers[i];
                return n[e] || (1 === i.length ? n[e] = function t() {
                    return dynCall(i, e)
                } : 2 === i.length ? n[e] = function r(n) {
                    return dynCall(i, e, [n])
                } : n[e] = function _() {
                    return dynCall(i, e, Array.prototype.slice.call(arguments))
                }), n[e]
            }
        }

        function makeBigInt(e, i, n) {
            return n ? +(e >>> 0) + 4294967296 * +(i >>> 0) : +(e >>> 0) + 4294967296 * +(0 | i)
        }

        function dynCall(e, i, n) {
            return n && n.length ? Module["dynCall_" + e].apply(null, [i].concat(n)) : Module["dynCall_" + e].call(null, i)
        }

        function assert(e, i) {
            e || abort("Assertion failed: " + i)
        }

        function getCFunc(e) {
            var i = Module["_" + e];
            return assert(i, "Cannot call unknown function " + e + ", make sure it is exported"), i
        }

        function ccall(e, i, n, t, r) {
            function _(e) {
                return "string" === i ? Pointer_stringify(e) : "boolean" === i ? Boolean(e) : e
            }
            var o, a, l, u = getCFunc(e),
                s = [],
                c = 0;
            if (t)
                for (o = 0; o < t.length; o++) a = toC[n[o]], a ? (0 === c && (c = stackSave()), s[o] = a(t[o])) : s[o] = t[o];
            return l = u.apply(null, s), l = _(l), 0 !== c && stackRestore(c), l
        }

        function cwrap(e, i, n, t) {
            var r, _;
            return n = n || [], r = n.every(function(e) {
                return "number" === e
            }), _ = "string" !== i, _ && r && !t ? getCFunc(e) : function() {
                return ccall(e, i, n, arguments, t)
            }
        }

        function setValue(e, i, n, t) {
            switch (n = n || "i8", "*" === n.charAt(n.length - 1) && (n = "i32"), n) {
                case "i1":
                    HEAP8[e >> 0] = i;
                    break;
                case "i8":
                    HEAP8[e >> 0] = i;
                    break;
                case "i16":
                    HEAP16[e >> 1] = i;
                    break;
                case "i32":
                    HEAP32[e >> 2] = i;
                    break;
                case "i64":
                    tempI64 = [i >>> 0, (tempDouble = i, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[e >> 2] = tempI64[0], HEAP32[e + 4 >> 2] = tempI64[1];
                    break;
                case "float":
                    HEAPF32[e >> 2] = i;
                    break;
                case "double":
                    HEAPF64[e >> 3] = i;
                    break;
                default:
                    abort("invalid type for setValue: " + n)
            }
        }

        function allocate(e, i, n, t) {
            var r, _, o, a, l, u, s, c, f, d;
            if ("number" == typeof e ? (r = !0, _ = e) : (r = !1, _ = e.length), o = "string" == typeof i ? i : null, a = n == ALLOC_NONE ? t : ["function" == typeof _malloc ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][undefined === n ? ALLOC_STATIC : n](Math.max(_, o ? 1 : i.length)), r) {
                for (t = a, assert(0 == (3 & a)), l = a + (_ & ~3); l > t; t += 4) HEAP32[t >> 2] = 0;
                l = a + _;
                while (l > t) HEAP8[t++ >> 0] = 0;
                return a
            }
            if ("i8" === o) return e.subarray || e.slice ? HEAPU8.set(e, a) : HEAPU8.set(new Uint8Array(e), a), a;
            u = 0;
            while (_ > u) d = e[u], s = o || i[u], 0 !== s ? ("i64" == s && (s = "i32"), setValue(a + u, d, s), f !== s && (c = getNativeTypeSize(s), f = s), u += c) : u++;
            return a
        }

        function getMemory(e) {
            return staticSealed ? runtimeInitialized ? _malloc(e) : dynamicAlloc(e) : staticAlloc(e)
        }

        function Pointer_stringify(e, i) {
            var n, t, r, _, o, a;
            if (0 === i || !e) return "";
            n = 0, r = 0;
            while (1) {
                if (t = HEAPU8[e + r >> 0], n |= t, 0 == t && !i) break;
                if (r++, i && r == i) break
            }
            if (i || (i = r), _ = "", 128 > n) {
                o = 1024;
                while (i > 0) a = String.fromCharCode.apply(String, HEAPU8.subarray(e, e + Math.min(i, o))), _ = _ ? _ + a : a, e += o, i -= o;
                return _
            }
            return UTF8ToString(e)
        }

        function UTF8ArrayToString(e, i) {
            var n, t, r, _, o, a, l, u, s = i;
            while (e[s]) ++s;
            if (s - i > 16 && e.subarray && UTF8Decoder) return UTF8Decoder.decode(e.subarray(i, s));
            l = "";
            while (1) {
                if (n = e[i++], !n) return l;
                128 & n ? (t = 63 & e[i++], 192 != (224 & n) ? (r = 63 & e[i++], 224 == (240 & n) ? n = (15 & n) << 12 | t << 6 | r : (_ = 63 & e[i++], 240 == (248 & n) ? n = (7 & n) << 18 | t << 12 | r << 6 | _ : (o = 63 & e[i++], 248 == (252 & n) ? n = (3 & n) << 24 | t << 18 | r << 12 | _ << 6 | o : (a = 63 & e[i++], n = (1 & n) << 30 | t << 24 | r << 18 | _ << 12 | o << 6 | a))), 65536 > n ? l += String.fromCharCode(n) : (u = n - 65536, l += String.fromCharCode(55296 | u >> 10, 56320 | 1023 & u))) : l += String.fromCharCode((31 & n) << 6 | t)) : l += String.fromCharCode(n)
            }
        }

        function UTF8ToString(e) {
            return UTF8ArrayToString(HEAPU8, e)
        }

        function stringToUTF8Array(e, i, n, t) {
            var r, _, o, a, l;
            if (!(t > 0)) return 0;
            for (r = n, _ = n + t - 1, o = 0; o < e.length; ++o)
                if (a = e.charCodeAt(o), a >= 55296 && 57343 >= a && (l = e.charCodeAt(++o), a = 65536 + ((1023 & a) << 10) | 1023 & l), 127 >= a) {
                    if (n >= _) break;
                    i[n++] = a
                } else if (2047 >= a) {
                if (n + 1 >= _) break;
                i[n++] = 192 | a >> 6, i[n++] = 128 | 63 & a
            } else if (65535 >= a) {
                if (n + 2 >= _) break;
                i[n++] = 224 | a >> 12, i[n++] = 128 | a >> 6 & 63, i[n++] = 128 | 63 & a
            } else if (2097151 >= a) {
                if (n + 3 >= _) break;
                i[n++] = 240 | a >> 18, i[n++] = 128 | a >> 12 & 63, i[n++] = 128 | a >> 6 & 63, i[n++] = 128 | 63 & a
            } else if (67108863 >= a) {
                if (n + 4 >= _) break;
                i[n++] = 248 | a >> 24, i[n++] = 128 | a >> 18 & 63, i[n++] = 128 | a >> 12 & 63, i[n++] = 128 | a >> 6 & 63, i[n++] = 128 | 63 & a
            } else {
                if (n + 5 >= _) break;
                i[n++] = 252 | a >> 30, i[n++] = 128 | a >> 24 & 63, i[n++] = 128 | a >> 18 & 63, i[n++] = 128 | a >> 12 & 63, i[n++] = 128 | a >> 6 & 63, i[n++] = 128 | 63 & a
            }
            return i[n] = 0, n - r
        }

        function stringToUTF8(e, i, n) {
            return stringToUTF8Array(e, HEAPU8, i, n)
        }

        function lengthBytesUTF8(e) {
            var i, n, t = 0;
            for (i = 0; i < e.length; ++i) n = e.charCodeAt(i), n >= 55296 && 57343 >= n && (n = 65536 + ((1023 & n) << 10) | 1023 & e.charCodeAt(++i)), 127 >= n ? ++t : t += 2047 >= n ? 2 : 65535 >= n ? 3 : 2097151 >= n ? 4 : 67108863 >= n ? 5 : 6;
            return t
        }

        function allocateUTF8(e) {
            var i = lengthBytesUTF8(e) + 1,
                n = _malloc(i);
            return n && stringToUTF8Array(e, HEAP8, n, i), n
        }

        function allocateUTF8OnStack(e) {
            var i = lengthBytesUTF8(e) + 1,
                n = stackAlloc(i);
            return stringToUTF8Array(e, HEAP8, n, i), n
        }

        function demangle(e) {
            return e
        }

        function demangleAll(e) {
            var i = /__Z[\w\d_]+/g;
            return e.replace(i, function(e) {
                var i = demangle(e);
                return e === i ? e : e + " [" + i + "]"
            })
        }

        function jsStackTrace() {
            var e = new Error;
            if (!e.stack) {
                try {
                    throw new Error(0)
                } catch (i) {
                    e = i
                }
                if (!e.stack) return "(no stack trace available)"
            }
            return e.stack.toString()
        }

        function stackTrace() {
            var e = jsStackTrace();
            return Module["extraStackTrace"] && (e += "\n" + Module["extraStackTrace"]()), demangleAll(e)
        }

        function alignUp(e, i) {
            return e % i > 0 && (e += i - e % i), e
        }

        function updateGlobalBuffer(e) {
            Module["buffer"] = buffer = e
        }

        function updateGlobalBufferViews() {
            Module["HEAP8"] = HEAP8 = new Int8Array(buffer), Module["HEAP16"] = HEAP16 = new Int16Array(buffer), Module["HEAP32"] = HEAP32 = new Int32Array(buffer), Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer), Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer), Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer), Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer), Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer)
        }

        function abortOnCannotGrowMemory() {
            abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
        }

        function enlargeMemory() {
            var e, i, n = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE,
                t = 2147483648 - n;
            if (HEAP32[DYNAMICTOP_PTR >> 2] > t) return !1;
            e = TOTAL_MEMORY, TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY);
            while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR >> 2]) TOTAL_MEMORY = 536870912 >= TOTAL_MEMORY ? alignUp(2 * TOTAL_MEMORY, n) : Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, n), t);
            return i = Module["reallocBuffer"](TOTAL_MEMORY), i && i.byteLength == TOTAL_MEMORY ? (updateGlobalBuffer(i), updateGlobalBufferViews(), !0) : (TOTAL_MEMORY = e, !1)
        }

        function getTotalMemory() {
            return TOTAL_MEMORY
        }

        function callRuntimeCallbacks(e) {
            var i, n;
            while (e.length > 0) i = e.shift(), "function" != typeof i ? (n = i.func, "number" == typeof n ? undefined === i.arg ? Module["dynCall_v"](n) : Module["dynCall_vi"](n, i.arg) : n(undefined === i.arg ? null : i.arg)) : i()
        }

        function preRun() {
            if (Module["preRun"]) {
                "function" == typeof Module["preRun"] && (Module["preRun"] = [Module["preRun"]]);
                while (Module["preRun"].length) addOnPreRun(Module["preRun"].shift())
            }
            callRuntimeCallbacks(__ATPRERUN__)
        }

        function ensureInitRuntime() {
            runtimeInitialized || (runtimeInitialized = !0, callRuntimeCallbacks(__ATINIT__))
        }

        function preMain() {
            callRuntimeCallbacks(__ATMAIN__)
        }

        function exitRuntime() {
            callRuntimeCallbacks(__ATEXIT__), runtimeExited = !0
        }

        function postRun() {
            if (Module["postRun"]) {
                "function" == typeof Module["postRun"] && (Module["postRun"] = [Module["postRun"]]);
                while (Module["postRun"].length) addOnPostRun(Module["postRun"].shift())
            }
            callRuntimeCallbacks(__ATPOSTRUN__)
        }

        function addOnPreRun(e) {
            __ATPRERUN__.unshift(e)
        }

        function addOnPostRun(e) {
            __ATPOSTRUN__.unshift(e)
        }

        function writeArrayToMemory(e, i) {
            HEAP8.set(e, i)
        }

        function writeAsciiToMemory(e, i, n) {
            for (var t = 0; t < e.length; ++t) HEAP8[i++ >> 0] = e.charCodeAt(t);
            n || (HEAP8[i >> 0] = 0)
        }

        function unSign(e, i, n) {
            return e >= 0 ? e : 32 >= i ? 2 * Math.abs(1 << i - 1) + e : Math.pow(2, i) + e
        }

        function reSign(e, i, n) {
            if (0 >= e) return e;
            var t = 32 >= i ? Math.abs(1 << i - 1) : Math.pow(2, i - 1);
            return e >= t && (32 >= i || e > t) && (e = -2 * t + e), e
        }

        function getUniqueRunDependency(e) {
            return e
        }

        function addRunDependency(e) {
            runDependencies++, Module["monitorRunDependencies"] && Module["monitorRunDependencies"](runDependencies)
        }

        function removeRunDependency(e) {
            if (runDependencies--, Module["monitorRunDependencies"] && Module["monitorRunDependencies"](runDependencies), 0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled)) {
                var i = dependenciesFulfilled;
                dependenciesFulfilled = null, i()
            }
        }

        function isDataURI(e) {
            return String.prototype.startsWith ? e.startsWith(dataURIPrefix) : 0 === e.indexOf(dataURIPrefix)
        }

        function integrateWasmJS() {
            function e(e) {
                var i, n, t = Module["buffer"];
                e.byteLength < t.byteLength && err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here"), i = new Int8Array(t), n = new Int8Array(e), n.set(i), updateGlobalBuffer(e), updateGlobalBufferViews()
            }

            function i(e) {
                return e
            }

            function n() {
                try {
                    if (Module["wasmBinary"]) return new Uint8Array(Module["wasmBinary"]);
                    if (Module["readBinary"]) return Module["readBinary"](f);
                    throw "both async and sync fetching of the wasm failed"
                } catch (e) {
                    abort(e)
                }
            }

            function t() {
                return Module["wasmBinary"] || !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER || "function" != typeof fetch ? new Promise(function(e, i) {
                    e(n())
                }) : fetch(f, {
                    credentials: "same-origin"
                }).then(function(e) {
                    if (!e["ok"]) throw "failed to load wasm binary file at '" + f + "'";
                    return e["arrayBuffer"]()
                })["catch"](function() {
                    return n()
                })
            }

            function r(i, n, r) {
                function _(i, n) {
                    a = i.exports, a.memory && e(a.memory), Module["asm"] = a, Module["usingWasm"] = !0, removeRunDependency("wasm-instantiate")
                }

                function l(e) {
                    _(e["instance"], e["module"])
                }

                function u(e) {
                    t().then(function(e) {
                        return WebAssembly.instantiate(e, o)
                    }).then(e)["catch"](function(e) {
                        err("failed to asynchronously prepare wasm: " + e), abort(e)
                    })
                }
                if ("object" != typeof WebAssembly) return err("no native wasm support detected"), !1;
                if (!(Module["wasmMemory"] instanceof WebAssembly.Memory)) return err("no native wasm Memory in use"), !1;
                if (n["memory"] = Module["wasmMemory"], o["global"] = {
                        NaN: NaN,
                        Infinity: 1 / 0
                    }, o["global.Math"] = Math, o["env"] = n, addRunDependency("wasm-instantiate"), Module["instantiateWasm"]) try {
                    return Module["instantiateWasm"](o, _)
                } catch (s) {
                    return err("Module.instantiateWasm callback failed with error: " + s), !1
                }
                return Module["wasmBinary"] || "function" != typeof WebAssembly.instantiateStreaming || isDataURI(f) || "function" != typeof fetch ? u(l) : WebAssembly.instantiateStreaming(fetch(f, {
                    credentials: "same-origin"
                }), o).then(l)["catch"](function(e) {
                    err("wasm streaming compile failed: " + e), err("falling back to ArrayBuffer instantiation"), u(l)
                }), {}
            }
            var _, o, a, l, u, s, c = "build.wast",
                f = "build.wasm",
                d = "build.temp.asm.js";
            isDataURI(c) || (c = locateFile(c)), isDataURI(f) || (f = locateFile(f)), isDataURI(d) || (d = locateFile(d)), _ = 64 * 1024, o = {
                global: null,
                env: null,
                asm2wasm: asm2wasmImports,
                parent: Module
            }, a = null, Module["asmPreload"] = Module["asm"], l = Module["reallocBuffer"], u = function(e) {
                var i, n, t, r = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
                if (e = alignUp(e, r), i = Module["buffer"], n = i.byteLength, Module["usingWasm"]) try {
                    return t = Module["wasmMemory"].grow((e - n) / _), t !== (0 | -1) ? Module["buffer"] = Module["wasmMemory"].buffer : null
                } catch (o) {
                    return null
                }
            }, Module["reallocBuffer"] = function(e) {
                return "asmjs" === s ? l(e) : u(e)
            }, s = "", Module["asm"] = function(e, n, t) {
                var _, o, a;
                return n = i(n), n["table"] || (_ = Module["wasmTableSize"], undefined === _ && (_ = 1024), o = Module["wasmMaxTableSize"], "object" == typeof WebAssembly && "function" == typeof WebAssembly.Table ? undefined !== o ? n["table"] = new WebAssembly.Table({
                    initial: _,
                    maximum: o,
                    element: "anyfunc"
                }) : n["table"] = new WebAssembly.Table({
                    initial: _,
                    element: "anyfunc"
                }) : n["table"] = new Array(_), Module["wasmTable"] = n["table"]), n["memoryBase"] || (n["memoryBase"] = Module["STATIC_BASE"]), n["tableBase"] || (n["tableBase"] = 0), a = r(e, n, t), assert(a, "no binaryen method succeeded."), a
            }
        }

        function _emscripten_asm_const_i(e) {
            return ASM_CONSTS[e]()
        }

        function _emscripten_asm_const_sync_on_main_thread_i(e) {
            return ASM_CONSTS[e]()
        }

        function _emscripten_asm_const_ii(e, i) {
            return ASM_CONSTS[e](i)
        }

        function _JS_Cursor_SetImage(e, i) {
            var n, t = "";
            for (n = 0; i > n; n++) t += String.fromCharCode(HEAPU8[e + n]);
            Module.canvas.style.cursor = "url(data:image/cur;base64," + btoa(t) + "),default"
        }

        function _JS_Cursor_SetShow(e) {
            Module.canvas.style.cursor = e ? "default" : "none"
        }

        function _JS_Eval_ClearTimeout(e) {
            window.clearTimeout(e)
        }

        function _JS_Eval_EvalJS(ptr) {
            var str = Pointer_stringify(ptr);
            try {
                eval(str)
            } catch (exception) {
                console.error(exception)
            }
        }

        function _JS_Eval_OpenURL(e) {
            
        }

        function _JS_Eval_SetTimeout(e, i, n) {
            function t() {
                getFuncWrapper(e, "vi")(i)
            }
            return Module["noExitRuntime"] = !0, Browser.safeSetTimeout(t, n)
        }

        function _JS_FileSystem_Initialize() {
            Module.indexedDB && Module.setInterval(function() {
                fs.sync(!0)
            }, fs.syncInternal)
        }

        function _JS_FileSystem_Sync() {
            Module.indexedDB && fs.sync(!1)
        }

        function _JS_Log_Dump(e, i) {
            var n = Pointer_stringify(e);
            switch ("function" == typeof dump && dump(n), i) {
                case 0:
                case 1:
                case 4:
                    return console.error(n), undefined;
                case 2:
                    return console.warn(n), undefined;
                case 3:
                case 5:
                    return console.log(n), undefined;
                default:
                    console.error("Unknown console message type!"), console.error(n)
            }
        }

        function _JS_Log_StackTrace(e, i) {
            var n = stackTrace();
            return e && stringToUTF8(n, e, i), lengthBytesUTF8(n)
        }

        function _JS_Sound_Create_Channel(e, i) {
            if (0 != WEBAudio.audioWebEnabled) {
                var n = {
                    gain: WEBAudio.audioContext.createGain(),
                    panner: WEBAudio.audioContext.createPanner(),
                    threeD: !1,
                    playBuffer: function(n, t, r) {
                        this.source.buffer = t;
                        var _ = this;
                        this.source.onended = function() {
                            e && dynCall("vi", e, [i]), _.setup()
                        }, this.source.start(n, r)
                    },
                    setup: function() {
                        this.source = WEBAudio.audioContext.createBufferSource(), this.setupPanning()
                    },
                    setupPanning: function() {
                        this.threeD ? (this.source.disconnect(), this.source.connect(this.panner), this.panner.connect(this.gain)) : (this.panner.disconnect(), this.source.connect(this.gain))
                    }
                };
                return n.panner.rolloffFactor = 0, n.gain.connect(WEBAudio.audioContext.destination), n.setup(), WEBAudio.audioInstances.push(n) - 1
            }
        }

        function _JS_Sound_GetLength(e) {
            var i, n;
            return 0 == WEBAudio.audioWebEnabled ? 0 : (i = WEBAudio.audioInstances[e], n = 44100 / i.buffer.sampleRate, i.buffer.length * n)
        }

        function _JS_Sound_GetLoadState(e) {
            if (0 == WEBAudio.audioWebEnabled) return 2;
            var i = WEBAudio.audioInstances[e];
            return i.error ? 2 : i.buffer ? 0 : 1
        }

        function _JS_Sound_Init() {
            var e, i;
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext, WEBAudio.audioContext = new AudioContext, e = function() {
                    "suspended" === WEBAudio.audioContext.state ? WEBAudio.audioContext.resume() : Module.clearInterval(i)
                }, i = Module.setInterval(e, 400), WEBAudio.audioWebEnabled = 1
            } catch (n) {
                alert("Web Audio API is not supported in this browser")
            }
        }

        function _JS_Sound_Load(e, i) {
            var n, t;
            return 0 == WEBAudio.audioWebEnabled ? 0 : (n = {
                buffer: null,
                error: !1
            }, t = WEBAudio.audioInstances.push(n) - 1, WEBAudio.audioContext.decodeAudioData(HEAPU8.buffer.slice(e, e + i), function(e) {
                n.buffer = e
            }, function() {
                n.error = !0, console.log("Decode error.")
            }), t)
        }

        function _JS_Sound_Load_PCM(e, i, n, t) {
            var r, _, o, a, l, u;
            if (0 == WEBAudio.audioWebEnabled) return 0;
            for (r = {
                    buffer: WEBAudio.audioContext.createBuffer(e, i, n),
                    error: !1
                }, _ = 0; e > _; _++) o = (t >> 2) + i * _, a = r.buffer, l = a["copyToChannel"] || function(e, i, n) {
                var t = e.subarray(0, Math.min(e.length, this.length - (0 | n)));
                this.getChannelData(0 | i).set(t, 0 | n)
            }, l.apply(a, [HEAPF32.subarray(o, o + i), _, 0]);
            return u = WEBAudio.audioInstances.push(r) - 1, u
        }

        function _JS_Sound_Play(e, i, n, t) {
            var r, _;
            if (_JS_Sound_Stop(i, 0), 0 != WEBAudio.audioWebEnabled)
                if (r = WEBAudio.audioInstances[e], _ = WEBAudio.audioInstances[i], r.buffer) try {
                    _.playBuffer(WEBAudio.audioContext.currentTime + t, r.buffer, n)
                } catch (o) {
                    console.error("playBuffer error. Exception: " + o)
                } else console.log("Trying to play sound which is not loaded.")
        }

        function _JS_Sound_ReleaseInstance(e) {
            WEBAudio.audioInstances[e] = null
        }

        function _JS_Sound_ResumeIfNeeded() {
            0 != WEBAudio.audioWebEnabled && "suspended" === WEBAudio.audioContext.state && WEBAudio.audioContext.resume()
        }

        function _JS_Sound_Set3D(e, i) {
            var n = WEBAudio.audioInstances[e];
            n.threeD != i && (n.threeD = i, n.setupPanning())
        }

        function _JS_Sound_SetListenerOrientation(e, i, n, t, r, _) {
            0 != WEBAudio.audioWebEnabled && (WEBAudio.audioContext.listener.forwardX ? (WEBAudio.audioContext.listener.forwardX.setValueAtTime(-e, WEBAudio.audioContext.currentTime), WEBAudio.audioContext.listener.forwardY.setValueAtTime(-i, WEBAudio.audioContext.currentTime), WEBAudio.audioContext.listener.forwardZ.setValueAtTime(-n, WEBAudio.audioContext.currentTime), WEBAudio.audioContext.listener.upX.setValueAtTime(t, WEBAudio.audioContext.currentTime), WEBAudio.audioContext.listener.upY.setValueAtTime(r, WEBAudio.audioContext.currentTime), WEBAudio.audioContext.listener.upZ.setValueAtTime(_, WEBAudio.audioContext.currentTime)) : WEBAudio.audioContext.listener.setOrientation(-e, -i, -n, t, r, _))
        }

        function _JS_Sound_SetListenerPosition(e, i, n) {
            0 != WEBAudio.audioWebEnabled && (WEBAudio.audioContext.listener.positionX ? (WEBAudio.audioContext.listener.positionX.setValueAtTime(e, WEBAudio.audioContext.currentTime), WEBAudio.audioContext.listener.positionY.setValueAtTime(i, WEBAudio.audioContext.currentTime), WEBAudio.audioContext.listener.positionZ.setValueAtTime(n, WEBAudio.audioContext.currentTime)) : WEBAudio.audioContext.listener.setPosition(e, i, n))
        }

        function _JS_Sound_SetLoop(e, i) {
            0 != WEBAudio.audioWebEnabled && (WEBAudio.audioInstances[e].source.loop = i)
        }

        function _JS_Sound_SetLoopPoints(e, i, n) {
            if (0 != WEBAudio.audioWebEnabled) {
                var t = WEBAudio.audioInstances[e];
                t.source.loopStart = i, t.source.loopEnd = n
            }
        }

        function _JS_Sound_SetPitch(e, i) {
            0 != WEBAudio.audioWebEnabled && WEBAudio.audioInstances[e].source.playbackRate.setValueAtTime(i, WEBAudio.audioContext.currentTime)
        }

        function _JS_Sound_SetPosition(e, i, n, t) {
            0 != WEBAudio.audioWebEnabled && WEBAudio.audioInstances[e].panner.setPosition(i, n, t)
        }

        function _JS_Sound_SetVolume(e, i) {
            0 != WEBAudio.audioWebEnabled && WEBAudio.audioInstances[e].gain.gain.setValueAtTime(i, WEBAudio.audioContext.currentTime)
        }

        function _JS_Sound_Stop(e, i) {
            if (0 != WEBAudio.audioWebEnabled) {
                var n = WEBAudio.audioInstances[e];
                if (n.source.buffer) {
                    try {
                        n.source.stop(WEBAudio.audioContext.currentTime + i)
                    } catch (t) {
                        n.source.disconnect()
                    }
                    0 == i && (n.source.onended = function() {}, n.setup())
                }
            }
        }

        function _JS_SystemInfo_GetBrowserName(e, i) {
            var n = UnityLoader.SystemInfo.browser;
            return e && stringToUTF8(n, e, i), lengthBytesUTF8(n)
        }

        function _JS_SystemInfo_GetBrowserVersionString(e, i) {
            var n = UnityLoader.SystemInfo.browserVersion;
            return e && stringToUTF8(n, e, i), lengthBytesUTF8(n)
        }

        function _JS_SystemInfo_GetCurrentCanvasHeight() {
            return Module["canvas"].clientHeight
        }

        function _JS_SystemInfo_GetCurrentCanvasWidth() {
            return Module["canvas"].clientWidth
        }

        function _JS_SystemInfo_GetDocumentURL(e, i) {
            return e && stringToUTF8(document.URL, e, i), lengthBytesUTF8(document.URL)
        }

        function _JS_SystemInfo_GetGPUInfo(e, i) {
            var n = UnityLoader.SystemInfo.gpu;
            return e && stringToUTF8(n, e, i), lengthBytesUTF8(n)
        }

        function _JS_SystemInfo_GetHeight() {
            return UnityLoader.SystemInfo.height
        }

        function _JS_SystemInfo_GetLanguage(e, i) {
            var n = UnityLoader.SystemInfo.language;
            return e && stringToUTF8(n, e, i), lengthBytesUTF8(n)
        }

        function _JS_SystemInfo_GetMemory() {
            return TOTAL_MEMORY / (1024 * 1024)
        }

        function _JS_SystemInfo_GetOS(e, i) {
            var n = UnityLoader.SystemInfo.os + " " + UnityLoader.SystemInfo.osVersion;
            return e && stringToUTF8(n, e, i), lengthBytesUTF8(n)
        }

        function _JS_SystemInfo_GetWidth() {
            return UnityLoader.SystemInfo.width
        }

        function _JS_SystemInfo_HasCursorLock() {
            return UnityLoader.SystemInfo.hasCursorLock
        }

        function _JS_SystemInfo_HasFullscreen() {
            return UnityLoader.SystemInfo.hasFullscreen
        }

        function _JS_SystemInfo_HasWebGL() {
            return UnityLoader.SystemInfo.hasWebGL
        }

        function _JS_UNETWebSockets_HostsContainingMessagesCleanHost(e) {
            for (i = 0; i < UNETWebSocketsInstances.hostsContainingMessages.length; i++) null != UNETWebSocketsInstances.hostsContainingMessages[i] && UNETWebSocketsInstances.hostsContainingMessages[i].id == e && (UNETWebSocketsInstances.hostsContainingMessages[i] = null);
            var n = UNETWebSocketsInstances.hostsContainingMessages[0];
            null != n && (0 == n.messages.length ? n.inQueue = !1 : UNETWebSocketsInstances.hostsContainingMessages.push(n), UNETWebSocketsInstances.hostsContainingMessages.shift())
        }

        function _JS_UNETWebSockets_HostsContainingMessagesPush(e) {
            0 == e.inQueue && (UNETWebSocketsInstances.hostsContainingMessages.push(e), e.inQueue = !0)
        }

        function _JS_UNETWebSockets_AddHost(e) {
            var n = {
                socket: null,
                buffer: new Uint8Array(0),
                error: null,
                id: -1,
                state: UNETWebSocketsInstances.HostStates.Closed,
                pingTimeout: e,
                messages: []
            };
            for (i = 0; i < UNETWebSocketsInstances.hosts.length; i++)
                if (null == UNETWebSocketsInstances.hosts[i]) return n.id = i, UNETWebSocketsInstances.hosts[i] = n, i;
            return -1
        }

        function _JS_UNETWebSockets_Init() {
            UNETWebSocketsInstances.pingDataArray = new ArrayBuffer(1);
            var e = new Uint8Array(UNETWebSocketsInstances.pingDataArray);
            e[0] = 255
        }

        function _JS_UNETWebSockets_IsHostCorrect(e) {
            return e < UNETWebSocketsInstances.hosts.length && null != UNETWebSocketsInstances.hosts[e] && null != UNETWebSocketsInstances.hosts[e].socket ? !0 : !1
        }

        function _JS_UNETWebSockets_IsHostReadyToConnect(e) {
            return e < UNETWebSocketsInstances.hosts.length && null != UNETWebSocketsInstances.hosts[e] && null == UNETWebSocketsInstances.hosts[e].socket ? !0 : !1
        }

        function _JS_UNETWebSockets_SocketCleanEvnt() {
            var e = UNETWebSocketsInstances.hostsContainingMessages.shift();
            e.inQueue = !1, e.state == UNETWebSocketsInstances.HostStates.Opening ? (e.state = UNETWebSocketsInstances.HostStates.Connected, 0 != e.messages.length && _JS_UNETWebSockets_HostsContainingMessagesPush(e)) : e.state == UNETWebSocketsInstances.HostStates.Closing && 0 == e.messages.length ? UNETWebSocketsInstances.hosts[e.id] = null : (e.messages.shift(), 0 != e.messages.length && _JS_UNETWebSockets_HostsContainingMessagesPush(e))
        }

        function _JS_UNETWebSockets_SocketCleanEvntFromHost(e) {
            UNETWebSocketsInstances.hosts[e].state == UNETWebSocketsInstances.HostStates.Opening ? UNETWebSocketsInstances.hosts[e].state = UNETWebSocketsInstances.HostStates.Connected : 0 != UNETWebSocketsInstances.hosts[e].messages.length ? UNETWebSocketsInstances.hosts[e].messages.shift() : UNETWebSocketsInstances.hosts[e].state == UNETWebSocketsInstances.HostStates.Closing && (UNETWebSocketsInstances.hosts[e].state = UNETWebSocketsInstances.HostStates.Closed, UNETWebSocketsInstances.hosts[e] = null, _JS_UNETWebSockets_HostsContainingMessagesCleanHost(e))
        }

        function _JS_UNETWebSockets_SocketClose(e) {
            var i = UNETWebSocketsInstances.hosts[e];
            null != i.socket && i.socket.close()
        }

        function _JS_UNETWebSockets_SocketCreate(e, i) {
            function n(e) {
                var i = Date.now(),
                    n = new ArrayBuffer(1),
                    t = new Uint8Array(n);
                t[0] = 255, i - e.lastSentTime > e.pingTimeout && (e.socket.send(UNETWebSocketsInstances.pingDataArray), e.lastSentTime = i)
            }

            function t(e) {
                e.timerID && (Module.clearInterval(e.timerID), e.timerID = 0)
            }
            var r = Pointer_stringify(i),
                _ = {
                    socket: new WebSocket(r, ["unitygame"]),
                    buffer: new Uint8Array(0),
                    error: null,
                    id: e,
                    state: UNETWebSocketsInstances.HostStates.Created,
                    inQueue: !1,
                    timerID: 0,
                    pingTimeout: 0,
                    lastSentTime: Date.now(),
                    messages: []
                };
            _.socket.onopen = function() {
                _.state = UNETWebSocketsInstances.HostStates.Opening, _JS_UNETWebSockets_HostsContainingMessagesPush(_), _.timerID = Module.setInterval(function() {
                    n(_)
                }, _.pingTimeout)
            }, _.socket.onmessage = function(e) {
                if (e.data instanceof Blob) {
                    var i = new FileReader;
                    i.addEventListener("loadend", function() {
                        var e = new Uint8Array(i.result);
                        _JS_UNETWebSockets_HostsContainingMessagesPush(_), (1 != e.length || 255 != e[0]) && _.messages.push(e)
                    }), i.readAsArrayBuffer(e.data)
                }
            }, _.socket.onclose = function(e) {
                t(_), _.state != UNETWebSocketsInstances.HostStates.Closed && (_.state = UNETWebSocketsInstances.HostStates.Closing, _JS_UNETWebSockets_HostsContainingMessagesPush(_))
            }, _.socket.onerror = function(e) {
                console.log("Error: " + e.data + " socket will be closed"), _.state = UNETWebSocketsInstances.HostStates.Closing, _JS_UNETWebSockets_HostsContainingMessagesPush(_)
            }, _.pingTimeout = UNETWebSocketsInstances.hosts[_.id].pingTimeout, UNETWebSocketsInstances.hosts[_.id] = _
        }

        function _JS_UNETWebSockets_SocketRecvEvntBuff(e, i) {
            HEAPU8.set(UNETWebSocketsInstances.hostsContainingMessages[0].messages[0], e)
        }

        function _JS_UNETWebSockets_SocketRecvEvntBuffFromHost(e, i, n) {
            HEAPU8.set(UNETWebSocketsInstances.hosts[e].messages[0], i)
        }

        function _JS_UNETWebSockets_SocketRecvEvntBuffLength() {
            return UNETWebSocketsInstances.hostsContainingMessages[0].messages[0].length
        }

        function _JS_UNETWebSockets_SocketRecvEvntBuffLengthFromHost(e) {
            return UNETWebSocketsInstances.hosts[e].messages[0].length
        }

        function _JS_UNETWebSockets_SocketRecvEvntHost() {
            return UNETWebSocketsInstances.hostsContainingMessages[0].id
        }

        function _JS_UNETWebSockets_SocketRecvEvntType() {
            if (0 == UNETWebSocketsInstances.hostsContainingMessages.length) return UNETWebSocketsInstances.EventTypes.Nothing;
            while (0 != UNETWebSocketsInstances.hostsContainingMessages.length)
                if (null == UNETWebSocketsInstances.hostsContainingMessages[0]) UNETWebSocketsInstances.hostsContainingMessages.shift();
                else if (UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Closed) UNETWebSocketsInstances.hostsContainingMessages.shift();
            else {
                if (UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Opening) break;
                if (UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Closing) break;
                if (0 != UNETWebSocketsInstances.hostsContainingMessages[0].messages.length) break;
                UNETWebSocketsInstances.hostsContainingMessages[0].inQueue = !1, UNETWebSocketsInstances.hostsContainingMessages.shift()
            }
            return 0 == UNETWebSocketsInstances.hostsContainingMessages.length ? UNETWebSocketsInstances.EventTypes.Nothing : UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Opening ? UNETWebSocketsInstances.EventTypes.ConnectEvent : UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Closing && 0 == UNETWebSocketsInstances.hostsContainingMessages[0].messages.length ? UNETWebSocketsInstances.EventTypes.DisconnectEvent : UNETWebSocketsInstances.EventTypes.DataEvent
        }

        function _JS_UNETWebSockets_SocketRecvEvntTypeFromHost(e) {
            var i = UNETWebSocketsInstances.EventTypes.Nothing;
            return UNETWebSocketsInstances.hosts[e].state == UNETWebSocketsInstances.HostStates.Opening ? i = UNETWebSocketsInstances.EventTypes.ConnectEvent : 0 != UNETWebSocketsInstances.hosts[e].messages.length ? i = UNETWebSocketsInstances.EventTypes.DataEvent : UNETWebSocketsInstances.hosts[e].state == UNETWebSocketsInstances.HostStates.Closing && (i = UNETWebSocketsInstances.EventTypes.DisconnectEvent), i
        }

        function _JS_UNETWebSockets_SocketSend(e, i, n) {
            var t = UNETWebSocketsInstances.hosts[e];
            0 != t && 1 == t.socket.readyState && t.state == UNETWebSocketsInstances.HostStates.Connected && (t.socket.send(HEAPU8.buffer.slice(i, i + n)), t.lastSentTime = Date.now())
        }

        function _JS_UNETWebSockets_SocketStop() {
            for (i = 0; i < UNETWebSocketsInstances.hosts.length; i++)
                if (null != UNETWebSocketsInstances.hosts[i] && null != UNETWebSocketsInstances.hosts[i].socket) {
                    var e = UNETWebSocketsInstances.hosts[i];
                    e.socket.close(), UNETWebSocketsInstances.hosts[i] = null
                } UNETWebSocketsInstances.hosts = new Array(UNETWebSocketsInstances.hosts.length), UNETWebSocketsInstances.hostsContainingMessages = new Array
        }

        function _JS_WebRequest_Abort(e) {
            wr.requestInstances[e].abort()
        }

        function _JS_WebRequest_Create(e, i) {
            var n = new XMLHttpRequest,
                t = Pointer_stringify(e),
                r = Pointer_stringify(i);
            return n.open(r, t, !0), n.responseType = "arraybuffer", wr.requestInstances[wr.nextRequestId] = n, wr.nextRequestId++
        }

        function _JS_WebRequest_GetResponseHeaders(e, i, n) {
            var t = wr.requestInstances[e].getAllResponseHeaders();
            return i && stringToUTF8(t, i, n), lengthBytesUTF8(t)
        }

        function _JS_WebRequest_Release(e) {
            var i = wr.requestInstances[e];
            i.onload = null, i.onerror = null, i.ontimeout = null, i.onabort = null, delete i, wr.requestInstances[e] = null
        }

        function _JS_WebRequest_Send(e, i, n) {
           
        }

        function _JS_WebRequest_SetProgressHandler(e, i, n) {
            var t = wr.requestInstances[e];
            t.onprogress = function r(e) {
                n && e.lengthComputable && dynCall("viii", n, [i, e.loaded, e.total])
            }
        }

        function _JS_WebRequest_SetRequestHeader(e, i, n) {
            var t = Pointer_stringify(i),
                r = Pointer_stringify(n);
            wr.requestInstances[e].setRequestHeader(t, r)
        }

        function _JS_WebRequest_SetResponseHandler(e, i, n) {
            function t(e, t) {
                var _, o;
                n && (_ = lengthBytesUTF8(e) + 1, o = _malloc(_), stringToUTF8(e, o, _), dynCall("viiiiii", n, [i, r.status, 0, 0, o, t]), _free(o))
            }
            var r = wr.requestInstances[e];
            r.onload = function _(e) {
                var t, _, o;
                n && (t = 0, _ = new Uint8Array(r.response), 0 != _.length ? (o = _malloc(_.length), HEAPU8.set(_, o), dynCall("viiiiii", n, [i, r.status, o, _.length, 0, t])) : dynCall("viiiiii", n, [i, r.status, 0, 0, 0, t]))
            }, r.onerror = function o(e) {
                var i = 2;
                t("Unknown error.", i)
            }, r.ontimeout = function a(e) {
                var i = 14;
                t("Connection timed out.", i)
            }, r.onabort = function l(e) {
                var i = 17;
                t("Aborted.", i)
            }
        }

        function _JS_WebRequest_SetTimeout(e, i) {
            wr.requestInstances[e].timeout = i
        }

        function __GameCenterGenerateIdentityVerificationSignature() {
            err("missing function: _GameCenterGenerateIdentityVerificationSignature"), abort(-1)
        }

        function __GameCenterGetLocalPlayer() {
            err("missing function: _GameCenterGetLocalPlayer"), abort(-1)
        }

        function __GameCenterInit() {
            err("missing function: _GameCenterInit"), abort(-1)
        }

        function __GameCenterLoadAchievementDescriptions() {
            err("missing function: _GameCenterLoadAchievementDescriptions"), abort(-1)
        }

        function __GameCenterLoadAchievements() {
            err("missing function: _GameCenterLoadAchievements"), abort(-1)
        }

        function __GameCenterLoadFriends() {
            err("missing function: _GameCenterLoadFriends"), abort(-1)
        }

        function __GameCenterLoadLeaderboard() {
            err("missing function: _GameCenterLoadLeaderboard"), abort(-1)
        }

        function __GameCenterLoadLeaderboardForIDs() {
            err("missing function: _GameCenterLoadLeaderboardForIDs"), abort(-1)
        }

        function __GameCenterLoadPhoto() {
            err("missing function: _GameCenterLoadPhoto"), abort(-1)
        }

        function __GameCenterLoadPlayers() {
            err("missing function: _GameCenterLoadPlayers"), abort(-1)
        }

        function __GameCenterReportAchievement() {
            err("missing function: _GameCenterReportAchievement"), abort(-1)
        }

        function __GameCenterReportAchievements() {
            err("missing function: _GameCenterReportAchievements"), abort(-1)
        }

        function __GameCenterReportScore() {
            err("missing function: _GameCenterReportScore"), abort(-1)
        }

        function __GameCenterResetAchievements() {
            err("missing function: _GameCenterResetAchievements"), abort(-1)
        }

        function __GameCenterShowLoginView() {
            err("missing function: _GameCenterShowLoginView"), abort(-1)
        }

        function __GameCenterShowView() {
            err("missing function: _GameCenterShowView"), abort(-1)
        }

        function ___atomic_fetch_add_8(e, i, n, t) {
            var r = HEAP32[e >> 2],
                _ = HEAP32[e + 4 >> 2];
            return HEAP32[e >> 2] = _i64Add(r, _, i, n), HEAP32[e + 4 >> 2] = getTempRet0(), 0 | (setTempRet0(_), r)
        }

        function ___buildEnvironment(e) {
            var i, n, t, r, _, o, a, l, u = 64,
                s = 1024;
            ___buildEnvironment.called ? (n = HEAP32[e >> 2], i = HEAP32[n >> 2]) : (___buildEnvironment.called = !0, ENV["USER"] = ENV["LOGNAME"] = "web_user", ENV["PATH"] = "/", ENV["PWD"] = "/", ENV["HOME"] = "/home/web_user", ENV["LANG"] = "C.UTF-8", ENV["_"] = Module["thisProgram"], i = getMemory(s), n = getMemory(4 * u), HEAP32[n >> 2] = i, HEAP32[e >> 2] = n), t = [], r = 0;
            for (_ in ENV) "string" == typeof ENV[_] && (o = _ + "=" + ENV[_], t.push(o), r += o.length);
            if (r > s) throw new Error("Environment size exceeded TOTAL_ENV_SIZE!");
            for (a = 4, l = 0; l < t.length; l++) o = t[l], writeAsciiToMemory(o, i), HEAP32[n + l * a >> 2] = i, i += o.length + 1;
            HEAP32[n + t.length * a >> 2] = 0
        }

        function ___cxa_allocate_exception(e) {
            return _malloc(e)
        }

        function __ZSt18uncaught_exceptionv() {
            return !!__ZSt18uncaught_exceptionv.uncaught_exception
        }

        function ___cxa_begin_catch(e) {
            var i = EXCEPTIONS.infos[e];
            return i && !i.caught && (i.caught = !0, __ZSt18uncaught_exceptionv.uncaught_exception--), i && (i.rethrown = !1), EXCEPTIONS.caught.push(e), EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(e)), e
        }

        function ___cxa_free_exception(e) {
            try {
                return _free(e)
            } catch (i) {}
        }

        function ___cxa_end_catch() {
            Module["setThrew"](0);
            var e = EXCEPTIONS.caught.pop();
            e && (EXCEPTIONS.decRef(EXCEPTIONS.deAdjust(e)), EXCEPTIONS.last = 0)
        }

        function ___cxa_find_matching_catch_2() {
            return ___cxa_find_matching_catch.apply(null, arguments)
        }

        function ___cxa_find_matching_catch_3() {
            return ___cxa_find_matching_catch.apply(null, arguments)
        }

        function ___cxa_find_matching_catch_4() {
            return ___cxa_find_matching_catch.apply(null, arguments)
        }

        function ___cxa_pure_virtual() {
            throw ABORT = !0, "Pure virtual function called!"
        }

        function ___cxa_rethrow() {
            var e = EXCEPTIONS.caught.pop();
            throw e = EXCEPTIONS.deAdjust(e), EXCEPTIONS.infos[e].rethrown || (EXCEPTIONS.caught.push(e), EXCEPTIONS.infos[e].rethrown = !0), EXCEPTIONS.last = e, e
        }

        function ___resumeException(e) {
            throw EXCEPTIONS.last || (EXCEPTIONS.last = e), e
        }

        function ___cxa_find_matching_catch() {
            var e, i, n, t, r, _ = EXCEPTIONS.last;
            if (!_) return 0 | (setTempRet0(0), 0);
            if (e = EXCEPTIONS.infos[_], i = e.type, !i) return 0 | (setTempRet0(0), _);
            for (n = Array.prototype.slice.call(arguments), t = Module["___cxa_is_pointer_type"](i), ___cxa_find_matching_catch.buffer || (___cxa_find_matching_catch.buffer = _malloc(4)), HEAP32[___cxa_find_matching_catch.buffer >> 2] = _, _ = ___cxa_find_matching_catch.buffer, r = 0; r < n.length; r++)
                if (n[r] && Module["___cxa_can_catch"](n[r], i, _)) return _ = HEAP32[_ >> 2], e.adjusted = _, 0 | (setTempRet0(n[r]), _);
            return _ = HEAP32[_ >> 2], 0 | (setTempRet0(i), _)
        }

        function ___cxa_throw(e, i, n) {
            throw EXCEPTIONS.infos[e] = {
                ptr: e,
                adjusted: e,
                type: i,
                destructor: n,
                refcount: 0,
                caught: !1,
                rethrown: !1
            }, EXCEPTIONS.last = e, "uncaught_exception" in __ZSt18uncaught_exceptionv ? __ZSt18uncaught_exceptionv.uncaught_exception++ : __ZSt18uncaught_exceptionv.uncaught_exception = 1, e
        }

        function ___gxx_personality_v0() {}

        function ___lock() {}

        function ___setErrNo(e) {
            return Module["___errno_location"] && (HEAP32[Module["___errno_location"]() >> 2] = e), e
        }

        function ___map_file(e, i) {
            return ___setErrNo(ERRNO_CODES.EPERM), -1
        }

        function ___syscall10(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr();
                return FS.unlink(n), 0
            } catch (t) {
                return "undefined" != typeof FS && t instanceof FS.ErrnoError || abort(t), -t.errno
            }
        }

        function __inet_pton4_raw(e) {
            var i, n, t = e.split(".");
            for (i = 0; 4 > i; i++) {
                if (n = Number(t[i]), isNaN(n)) return null;
                t[i] = n
            }
            return (t[0] | t[1] << 8 | t[2] << 16 | t[3] << 24) >>> 0
        }

        function __inet_pton6_raw(e) {
            var i, n, t, r, _ = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
                o = [];
            if (!_.test(e)) return null;
            if ("::" === e) return [0, 0, 0, 0, 0, 0, 0, 0];
            for (e = 0 === e.indexOf("::") ? e.replace("::", "Z:") : e.replace("::", ":Z:"), e.indexOf(".") > 0 ? (e = e.replace(new RegExp("[.]", "g"), ":"), i = e.split(":"), i[i.length - 4] = parseInt(i[i.length - 4]) + 256 * parseInt(i[i.length - 3]), i[i.length - 3] = parseInt(i[i.length - 2]) + 256 * parseInt(i[i.length - 1]), i = i.slice(0, i.length - 2)) : i = e.split(":"), t = 0, r = 0, n = 0; n < i.length; n++)
                if ("string" == typeof i[n])
                    if ("Z" === i[n]) {
                        for (r = 0; r < 8 - i.length + 1; r++) o[n + r] = 0;
                        t = r - 1
                    } else o[n + t] = _htons(parseInt(i[n], 16));
            else o[n + t] = i[n];
            return [o[1] << 16 | o[0], o[3] << 16 | o[2], o[5] << 16 | o[4], o[7] << 16 | o[6]]
        }

        function __inet_ntop4_raw(e) {
            return (255 & e) + "." + (e >> 8 & 255) + "." + (e >> 16 & 255) + "." + (e >> 24 & 255)
        }

        function __inet_ntop6_raw(e) {
            var i = "",
                n = 0,
                t = 0,
                r = 0,
                _ = 0,
                o = 0,
                a = 0,
                l = [65535 & e[0], e[0] >> 16, 65535 & e[1], e[1] >> 16, 65535 & e[2], e[2] >> 16, 65535 & e[3], e[3] >> 16],
                u = !0,
                s = "";
            for (a = 0; 5 > a; a++)
                if (0 !== l[a]) {
                    u = !1;
                    break
                } if (u) {
                if (s = __inet_ntop4_raw(l[6] | l[7] << 16), l[5] === -1) return i = "::ffff:", i += s, i;
                if (0 === l[5]) return i = "::", "0.0.0.0" === s && (s = ""), "0.0.0.1" === s && (s = "1"), i += s, i
            }
            for (n = 0; 8 > n; n++) 0 === l[n] && (n - r > 1 && (o = 0), r = n, o++), o > t && (t = o, _ = n - t + 1);
            for (n = 0; 8 > n; n++) t > 1 && 0 === l[n] && n >= _ && _ + t > n ? n === _ && (i += ":", 0 === _ && (i += ":")) : (i += Number(_ntohs(65535 & l[n])).toString(16), i += 7 > n ? ":" : "");
            return i
        }

        function __read_sockaddr(e, i) {
            var n, t = HEAP16[e >> 1],
                r = _ntohs(HEAP16[e + 2 >> 1]);
            switch (t) {
                case 2:
                    if (16 !== i) return {
                        errno: ERRNO_CODES.EINVAL
                    };
                    n = HEAP32[e + 4 >> 2], n = __inet_ntop4_raw(n);
                    break;
                case 10:
                    if (28 !== i) return {
                        errno: ERRNO_CODES.EINVAL
                    };
                    n = [HEAP32[e + 8 >> 2], HEAP32[e + 12 >> 2], HEAP32[e + 16 >> 2], HEAP32[e + 20 >> 2]], n = __inet_ntop6_raw(n);
                    break;
                default:
                    return {
                        errno: ERRNO_CODES.EAFNOSUPPORT
                    }
            }
            return {
                family: t,
                addr: n,
                port: r
            }
        }

        function __write_sockaddr(e, i, n, t) {
            switch (i) {
                case 2:
                    n = __inet_pton4_raw(n), HEAP16[e >> 1] = i, HEAP32[e + 4 >> 2] = n, HEAP16[e + 2 >> 1] = _htons(t);
                    break;
                case 10:
                    n = __inet_pton6_raw(n), HEAP32[e >> 2] = i, HEAP32[e + 8 >> 2] = n[0], HEAP32[e + 12 >> 2] = n[1], HEAP32[e + 16 >> 2] = n[2], HEAP32[e + 20 >> 2] = n[3], HEAP16[e + 2 >> 1] = _htons(t), HEAP32[e + 4 >> 2] = 0, HEAP32[e + 24 >> 2] = 0;
                    break;
                default:
                    return {
                        errno: ERRNO_CODES.EAFNOSUPPORT
                    }
            }
            return {}
        }

        function ___syscall102(e, i) {
            var n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g, S, L, E, h, b, C, M, k, A, w, G, O, R, I, j, B, T, F, P, D;
            SYSCALLS.varargs = i;
            try {
                switch (n = SYSCALLS.get(), t = SYSCALLS.get(), SYSCALLS.varargs = t, n) {
                    case 1:
                        return r = SYSCALLS.get(), _ = SYSCALLS.get(), o = SYSCALLS.get(), a = SOCKFS.createSocket(r, _, o), assert(a.stream.fd < 64), a.stream.fd;
                    case 2:
                        return a = SYSCALLS.getSocketFromFD(), l = SYSCALLS.getSocketAddress(), a.sock_ops.bind(a, l.addr, l.port), 0;
                    case 3:
                        return a = SYSCALLS.getSocketFromFD(), l = SYSCALLS.getSocketAddress(), a.sock_ops.connect(a, l.addr, l.port), 0;
                    case 4:
                        return a = SYSCALLS.getSocketFromFD(), u = SYSCALLS.get(), a.sock_ops.listen(a, u), 0;
                    case 5:
                        return a = SYSCALLS.getSocketFromFD(), s = SYSCALLS.get(), c = SYSCALLS.get(), f = a.sock_ops.accept(a), s && (d = __write_sockaddr(s, f.family, DNS.lookup_name(f.daddr), f.dport), assert(!d.errno)), f.stream.fd;
                    case 6:
                        return a = SYSCALLS.getSocketFromFD(), s = SYSCALLS.get(), c = SYSCALLS.get(), d = __write_sockaddr(s, a.family, DNS.lookup_name(a.saddr || "0.0.0.0"), a.sport), assert(!d.errno), 0;
                    case 7:
                        return a = SYSCALLS.getSocketFromFD(), s = SYSCALLS.get(), c = SYSCALLS.get(), a.daddr ? (d = __write_sockaddr(s, a.family, DNS.lookup_name(a.daddr), a.dport), assert(!d.errno), 0) : -ERRNO_CODES.ENOTCONN;
                    case 11:
                        return a = SYSCALLS.getSocketFromFD(), p = SYSCALLS.get(), m = SYSCALLS.get(), v = SYSCALLS.get(), y = SYSCALLS.getSocketAddress(!0), y ? a.sock_ops.sendmsg(a, HEAP8, p, m, y.addr, y.port) : FS.write(a.stream, HEAP8, p, m);
                    case 12:
                        return a = SYSCALLS.getSocketFromFD(), g = SYSCALLS.get(), S = SYSCALLS.get(), v = SYSCALLS.get(), s = SYSCALLS.get(), c = SYSCALLS.get(), L = a.sock_ops.recvmsg(a, S), L ? (s && (d = __write_sockaddr(s, a.family, DNS.lookup_name(L.addr), L.port), assert(!d.errno)), HEAPU8.set(L.buffer, g), L.buffer.byteLength) : 0;
                    case 14:
                        return -ERRNO_CODES.ENOPROTOOPT;
                    case 15:
                        return a = SYSCALLS.getSocketFromFD(), E = SYSCALLS.get(), h = SYSCALLS.get(), b = SYSCALLS.get(), C = SYSCALLS.get(), 1 === E && 4 === h ? (HEAP32[b >> 2] = a.error, HEAP32[C >> 2] = 4, a.error = null, 0) : -ERRNO_CODES.ENOPROTOOPT;
                    case 16:
                        if (a = SYSCALLS.getSocketFromFD(), p = SYSCALLS.get(), v = SYSCALLS.get(), M = HEAP32[p + 8 >> 2], k = HEAP32[p + 12 >> 2], w = HEAP32[p >> 2], G = HEAP32[p + 4 >> 2], w) {
                            if (l = __read_sockaddr(w, G), l.errno) return -l.errno;
                            A = l.port, s = DNS.lookup_addr(l.addr) || l.addr
                        }
                        for (O = 0, R = 0; k > R; R++) O += HEAP32[M + (8 * R + 4) >> 2];
                        for (I = new Uint8Array(O), j = 0, R = 0; k > R; R++)
                            for (B = HEAP32[M + (8 * R + 0) >> 2], T = HEAP32[M + (8 * R + 4) >> 2], F = 0; T > F; F++) I[j++] = HEAP8[B + F >> 0];
                        return a.sock_ops.sendmsg(a, I, 0, O, s, A);
                    case 17:
                        for (a = SYSCALLS.getSocketFromFD(), p = SYSCALLS.get(), v = SYSCALLS.get(), M = HEAP32[p + 8 >> 2], k = HEAP32[p + 12 >> 2], O = 0, R = 0; k > R; R++) O += HEAP32[M + (8 * R + 4) >> 2];
                        if (L = a.sock_ops.recvmsg(a, O), !L) return 0;
                        for (w = HEAP32[p >> 2], w && (d = __write_sockaddr(w, a.family, DNS.lookup_name(L.addr), L.port), assert(!d.errno)), P = 0, D = L.buffer.byteLength, R = 0; D > 0 && k > R; R++) B = HEAP32[M + (8 * R + 0) >> 2], T = HEAP32[M + (8 * R + 4) >> 2], T && (m = Math.min(T, D), g = L.buffer.subarray(P, P + m), HEAPU8.set(g, B + P), P += m, D -= m);
                        return P;
                    default:
                        abort("unsupported socketcall syscall " + n)
                }
            } catch (x) {
                return "undefined" != typeof FS && x instanceof FS.ErrnoError || abort(x), -x.errno
            }
        }

        function ___syscall122(e, i) {
            function n(e, i) {
                var n = r[e];
                writeAsciiToMemory(i, t + n)
            }
            var t, r;
            SYSCALLS.varargs = i;
            try {
                return t = SYSCALLS.get(), t ? (r = {
                    sysname: 0,
                    nodename: 65,
                    domainname: 325,
                    machine: 260,
                    version: 195,
                    release: 130,
                    __size__: 390
                }, n("sysname", "Emscripten"), n("nodename", "emscripten"), n("release", "1.0"), n("version", "#1"), n("machine", "x86-JS"), 0) : -ERRNO_CODES.EFAULT
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall140(e, i) {
            var n, t, r, _, o, a;
            SYSCALLS.varargs = i;
            try {
                return n = SYSCALLS.getStreamFromFD(), t = SYSCALLS.get(), r = SYSCALLS.get(), _ = SYSCALLS.get(), o = SYSCALLS.get(), a = r, FS.llseek(n, a, o), HEAP32[_ >> 2] = n.position, n.getdents && 0 === a && 0 === o && (n.getdents = null), 0
            } catch (l) {
                return "undefined" != typeof FS && l instanceof FS.ErrnoError || abort(l), -l.errno
            }
        }

        function ___syscall142(e, i) {
            function n(e, i, n, t) {
                return 32 > e ? i & t : n & t
            }
            var t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g, S, L, E, h, b, C, M, k;
            SYSCALLS.varargs = i;
            try {
                for (t = SYSCALLS.get(), r = SYSCALLS.get(), _ = SYSCALLS.get(), o = SYSCALLS.get(), a = SYSCALLS.get(), assert(64 >= t, "nfds must be less than or equal to 64"), assert(!o, "exceptfds not supported"), l = 0, u = r ? HEAP32[r >> 2] : 0, s = r ? HEAP32[r + 4 >> 2] : 0, c = _ ? HEAP32[_ >> 2] : 0, f = _ ? HEAP32[_ + 4 >> 2] : 0, d = o ? HEAP32[o >> 2] : 0, p = o ? HEAP32[o + 4 >> 2] : 0, m = 0, v = 0, y = 0, g = 0, S = 0, L = 0, E = (r ? HEAP32[r >> 2] : 0) | (_ ? HEAP32[_ >> 2] : 0) | (o ? HEAP32[o >> 2] : 0), h = (r ? HEAP32[r + 4 >> 2] : 0) | (_ ? HEAP32[_ + 4 >> 2] : 0) | (o ? HEAP32[o + 4 >> 2] : 0), b = 0; t > b; b++)
                    if (C = 1 << b % 32, n(b, E, h, C)) {
                        if (M = FS.getStream(b), !M) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                        k = SYSCALLS.DEFAULT_POLLMASK, M.stream_ops.poll && (k = M.stream_ops.poll(M)), 1 & k && n(b, u, s, C) && (32 > b ? m |= C : v |= C, l++), 4 & k && n(b, c, f, C) && (32 > b ? y |= C : g |= C, l++), 2 & k && n(b, d, p, C) && (32 > b ? S |= C : L |= C, l++)
                    } return r && (HEAP32[r >> 2] = m, HEAP32[r + 4 >> 2] = v), _ && (HEAP32[_ >> 2] = y, HEAP32[_ + 4 >> 2] = g), o && (HEAP32[o >> 2] = S, HEAP32[o + 4 >> 2] = L), l
            } catch (A) {
                return "undefined" != typeof FS && A instanceof FS.ErrnoError || abort(A), -A.errno
            }
        }

        function ___syscall145(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStreamFromFD(),
                    t = SYSCALLS.get(),
                    r = SYSCALLS.get();
                return SYSCALLS.doReadv(n, t, r)
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall146(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStreamFromFD(),
                    t = SYSCALLS.get(),
                    r = SYSCALLS.get();
                return SYSCALLS.doWritev(n, t, r)
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall15(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr(),
                    t = SYSCALLS.get();
                return FS.chmod(n, t), 0
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall168(e, i) {
            var n, t, r, _, o, a, l, u, s, c;
            SYSCALLS.varargs = i;
            try {
                for (n = SYSCALLS.get(), t = SYSCALLS.get(), r = SYSCALLS.get(), _ = 0, o = 0; t > o; o++) a = n + 8 * o, l = HEAP32[a >> 2], u = HEAP16[a + 4 >> 1], s = 32, c = FS.getStream(l), c && (s = SYSCALLS.DEFAULT_POLLMASK, c.stream_ops.poll && (s = c.stream_ops.poll(c))), s &= 8 | u | 16, s && _++, HEAP16[a + 6 >> 1] = s;
                return _
            } catch (f) {
                return "undefined" != typeof FS && f instanceof FS.ErrnoError || abort(f), -f.errno
            }
        }

        function ___syscall183(e, i) {
            var n, t, r, _;
            SYSCALLS.varargs = i;
            try {
                return n = SYSCALLS.get(), t = SYSCALLS.get(), 0 === t ? -ERRNO_CODES.EINVAL : (r = FS.cwd(), _ = lengthBytesUTF8(r), _ + 1 > t ? -ERRNO_CODES.ERANGE : (stringToUTF8(r, n, t), n))
            } catch (o) {
                return "undefined" != typeof FS && o instanceof FS.ErrnoError || abort(o), -o.errno
            }
        }

        function ___syscall192(e, i) {
            var n, t, r, _, o, a, l, u, s, c;
            SYSCALLS.varargs = i;
            try {
                if (n = SYSCALLS.get(), t = SYSCALLS.get(), r = SYSCALLS.get(), _ = SYSCALLS.get(), o = SYSCALLS.get(), a = SYSCALLS.get(), a <<= 12, u = !1, o === -1) {
                    if (l = _memalign(PAGE_SIZE, t), !l) return -ERRNO_CODES.ENOMEM;
                    _memset(l, 0, t), u = !0
                } else {
                    if (s = FS.getStream(o), !s) return -ERRNO_CODES.EBADF;
                    c = FS.mmap(s, HEAPU8, n, t, a, r, _), l = c.ptr, u = c.allocated
                }
                return SYSCALLS.mappings[l] = {
                    malloc: l,
                    len: t,
                    allocated: u,
                    fd: o,
                    flags: _
                }, l
            } catch (f) {
                return "undefined" != typeof FS && f instanceof FS.ErrnoError || abort(f), -f.errno
            }
        }

        function ___syscall193(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr(),
                    t = SYSCALLS.getZero(),
                    r = SYSCALLS.get64();
                return FS.truncate(n, r), 0
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall194(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.get(),
                    t = SYSCALLS.getZero(),
                    r = SYSCALLS.get64();
                return FS.ftruncate(n, r), 0
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall195(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr(),
                    t = SYSCALLS.get();
                return SYSCALLS.doStat(FS.stat, n, t)
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall196(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr(),
                    t = SYSCALLS.get();
                return SYSCALLS.doStat(FS.lstat, n, t)
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall197(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStreamFromFD(),
                    t = SYSCALLS.get();
                return SYSCALLS.doStat(FS.stat, n.path, t)
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall202(e, i) {
            SYSCALLS.varargs = i;
            try {
                return 0
            } catch (n) {
                return "undefined" != typeof FS && n instanceof FS.ErrnoError || abort(n), -n.errno
            }
        }

        function ___syscall199() {
            return ___syscall202.apply(null, arguments)
        }

        function ___syscall20(e, i) {
            SYSCALLS.varargs = i;
            try {
                return PROCINFO.pid
            } catch (n) {
                return "undefined" != typeof FS && n instanceof FS.ErrnoError || abort(n), -n.errno
            }
        }

        function ___syscall220(e, i) {
            var n, t, r, _, o, a, l, u;
            SYSCALLS.varargs = i;
            try {
                n = SYSCALLS.getStreamFromFD(), t = SYSCALLS.get(), r = SYSCALLS.get(), n.getdents || (n.getdents = FS.readdir(n.path)), _ = 0;
                while (n.getdents.length > 0 && r >= _ + 268) l = n.getdents.pop(), "." === l[0] ? (o = 1, a = 4) : (u = FS.lookupNode(n.node, l), o = u.id, a = FS.isChrdev(u.mode) ? 2 : FS.isDir(u.mode) ? 4 : FS.isLink(u.mode) ? 10 : 8), HEAP32[t + _ >> 2] = o, HEAP32[t + _ + 4 >> 2] = n.position, HEAP16[t + _ + 8 >> 1] = 268, HEAP8[t + _ + 10 >> 0] = a, stringToUTF8(l, t + _ + 11, 256), _ += 268;
                return _
            } catch (s) {
                return "undefined" != typeof FS && s instanceof FS.ErrnoError || abort(s), -s.errno
            }
        }

        function ___syscall221(e, i) {
            var n, t, r, _, o;
            SYSCALLS.varargs = i;
            try {
                switch (n = SYSCALLS.getStreamFromFD(), t = SYSCALLS.get(), t) {
                    case 0:
                        return r = SYSCALLS.get(), 0 > r ? -ERRNO_CODES.EINVAL : (_ = FS.open(n.path, n.flags, 0, r), _.fd);
                    case 1:
                    case 2:
                        return 0;
                    case 3:
                        return n.flags;
                    case 4:
                        return r = SYSCALLS.get(), n.flags |= r, 0;
                    case 12:
                    case 12:
                        return r = SYSCALLS.get(), o = 0, HEAP16[r + o >> 1] = 2, 0;
                    case 13:
                    case 14:
                    case 13:
                    case 14:
                        return 0;
                    case 16:
                    case 8:
                        return -ERRNO_CODES.EINVAL;
                    case 9:
                        return ___setErrNo(ERRNO_CODES.EINVAL), -1;
                    default:
                        return -ERRNO_CODES.EINVAL
                }
            } catch (a) {
                return "undefined" != typeof FS && a instanceof FS.ErrnoError || abort(a), -a.errno
            }
        }

        function ___syscall268(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr(),
                    t = SYSCALLS.get(),
                    r = SYSCALLS.get();
                return assert(64 === t), HEAP32[r + 4 >> 2] = 4096, HEAP32[r + 40 >> 2] = 4096, HEAP32[r + 8 >> 2] = 1e6, HEAP32[r + 12 >> 2] = 5e5, HEAP32[r + 16 >> 2] = 5e5, HEAP32[r + 20 >> 2] = FS.nextInode, HEAP32[r + 24 >> 2] = 1e6, HEAP32[r + 28 >> 2] = 42, HEAP32[r + 44 >> 2] = 2, HEAP32[r + 36 >> 2] = 255, 0
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall3(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStreamFromFD(),
                    t = SYSCALLS.get(),
                    r = SYSCALLS.get();
                return FS.read(n, HEAP8, t, r)
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall33(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr(),
                    t = SYSCALLS.get();
                return SYSCALLS.doAccess(n, t)
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall38(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr(),
                    t = SYSCALLS.getStr();
                return FS.rename(n, t), 0
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall39(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr(),
                    t = SYSCALLS.get();
                return SYSCALLS.doMkdir(n, t)
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall4(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStreamFromFD(),
                    t = SYSCALLS.get(),
                    r = SYSCALLS.get();
                return FS.write(n, HEAP8, t, r)
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall40(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr();
                return FS.rmdir(n), 0
            } catch (t) {
                return "undefined" != typeof FS && t instanceof FS.ErrnoError || abort(t), -t.errno
            }
        }

        function ___syscall41(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStreamFromFD();
                return FS.open(n.path, n.flags, 0).fd
            } catch (t) {
                return "undefined" != typeof FS && t instanceof FS.ErrnoError || abort(t), -t.errno
            }
        }

        function ___syscall42(e, i) {
            var n, t;
            SYSCALLS.varargs = i;
            try {
                if (n = SYSCALLS.get(), 0 == n) throw new FS.ErrnoError(ERRNO_CODES.EFAULT);
                return t = PIPEFS.createPipe(), HEAP32[n >> 2] = t.readable_fd, HEAP32[n + 4 >> 2] = t.writable_fd, 0
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall5(e, i) {
            var n, t, r, _;
            SYSCALLS.varargs = i;
            try {
                return n = SYSCALLS.getStr(), t = SYSCALLS.get(), r = SYSCALLS.get(), _ = FS.open(n, t, r), _.fd
            } catch (o) {
                return "undefined" != typeof FS && o instanceof FS.ErrnoError || abort(o), -o.errno
            }
        }

        function ___syscall54(e, i) {
            var n, t, r;
            SYSCALLS.varargs = i;
            try {
                switch (n = SYSCALLS.getStreamFromFD(), t = SYSCALLS.get(), t) {
                    case 21509:
                    case 21505:
                        return n.tty ? 0 : -ERRNO_CODES.ENOTTY;
                    case 21510:
                    case 21511:
                    case 21512:
                    case 21506:
                    case 21507:
                    case 21508:
                        return n.tty ? 0 : -ERRNO_CODES.ENOTTY;
                    case 21519:
                        return n.tty ? (r = SYSCALLS.get(), HEAP32[r >> 2] = 0, 0) : -ERRNO_CODES.ENOTTY;
                    case 21520:
                        return n.tty ? -ERRNO_CODES.EINVAL : -ERRNO_CODES.ENOTTY;
                    case 21531:
                        return r = SYSCALLS.get(), FS.ioctl(n, t, r);
                    case 21523:
                        return n.tty ? 0 : -ERRNO_CODES.ENOTTY;
                    case 21524:
                        return n.tty ? 0 : -ERRNO_CODES.ENOTTY;
                    default:
                        abort("bad ioctl syscall " + t)
                }
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall6(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStreamFromFD();
                return FS.close(n), 0
            } catch (t) {
                return "undefined" != typeof FS && t instanceof FS.ErrnoError || abort(t), -t.errno
            }
        }

        function ___syscall63(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStreamFromFD(),
                    t = SYSCALLS.get();
                return n.fd === t ? t : SYSCALLS.doDup(n.path, n.flags, t)
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall77(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.get(),
                    t = SYSCALLS.get();
                return _memset(t, 0, 136), HEAP32[t >> 2] = 1, HEAP32[t + 4 >> 2] = 2, HEAP32[t + 8 >> 2] = 3, HEAP32[t + 12 >> 2] = 4, 0
            } catch (r) {
                return "undefined" != typeof FS && r instanceof FS.ErrnoError || abort(r), -r.errno
            }
        }

        function ___syscall85(e, i) {
            SYSCALLS.varargs = i;
            try {
                var n = SYSCALLS.getStr(),
                    t = SYSCALLS.get(),
                    r = SYSCALLS.get();
                return SYSCALLS.doReadlink(n, t, r)
            } catch (_) {
                return "undefined" != typeof FS && _ instanceof FS.ErrnoError || abort(_), -_.errno
            }
        }

        function ___syscall91(e, i) {
            var n, t, r, _;
            SYSCALLS.varargs = i;
            try {
                return n = SYSCALLS.get(), t = SYSCALLS.get(), r = SYSCALLS.mappings[n], r ? (t === r.len && (_ = FS.getStream(r.fd), SYSCALLS.doMsync(n, _, t, r.flags), FS.munmap(_), SYSCALLS.mappings[n] = null, r.allocated && _free(r.malloc)), 0) : 0
            } catch (o) {
                return "undefined" != typeof FS && o instanceof FS.ErrnoError || abort(o), -o.errno
            }
        }

        function ___unlock() {}

        function _abort() {
            Module["abort"]()
        }

        function _atexit(e, i) {
            __ATEXIT__.unshift({
                func: e,
                arg: i
            })
        }

        function _clock() {
            return undefined === _clock.start && (_clock.start = Date.now()), (Date.now() - _clock.start) * (1e6 / 1e3) | 0
        }

        function _emscripten_get_now_res() {
            return ENVIRONMENT_IS_NODE ? 1 : "undefined" != typeof dateNow || (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self["performance"] && self["performance"]["now"] ? 1e3 : 1e3 * 1e3
        }

        function _emscripten_get_now() {
            abort()
        }

        function _emscripten_get_now_is_monotonic() {
            return ENVIRONMENT_IS_NODE || "undefined" != typeof dateNow || (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self["performance"] && self["performance"]["now"]
        }

        function _clock_getres(e, i) {
            var n;
            if (0 === e) n = 1e3 * 1e3;
            else {
                if (1 !== e || !_emscripten_get_now_is_monotonic()) return ___setErrNo(ERRNO_CODES.EINVAL), -1;
                n = _emscripten_get_now_res()
            }
            return HEAP32[i >> 2] = n / 1e9 | 0, HEAP32[i + 4 >> 2] = n, 0
        }

        function _clock_gettime(e, i) {
            var n;
            if (0 === e) n = Date.now();
            else {
                if (1 !== e || !_emscripten_get_now_is_monotonic()) return ___setErrNo(ERRNO_CODES.EINVAL), -1;
                n = _emscripten_get_now()
            }
            return HEAP32[i >> 2] = n / 1e3 | 0, HEAP32[i + 4 >> 2] = n % 1e3 * 1e3 * 1e3 | 0, 0
        }

        function _difftime(e, i) {
            return e - i
        }

        function _dlclose(e) {
            if (DLFCN.loadedLibs[e]) {
                var i = DLFCN.loadedLibs[e];
                return 0 == --i.refcount && (i.module.cleanups && i.module.cleanups.forEach(function(e) {
                    e()
                }), delete DLFCN.loadedLibNames[i.name], delete DLFCN.loadedLibs[e]), 0
            }
            return DLFCN.errorMsg = "Tried to dlclose() unopened handle: " + e, 1
        }

        function _dlopen(e, i) {
            var n, t, r, _, o, a, l, u, s, c;
            if (abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/kripken/emscripten/wiki/Linking"), n = [], 0 === e) e = "__self__";
            else if (t = Pointer_stringify(e), r = function(e) {
                    var i = FS.findObject(e);
                    return i && !i.isFolder && !i.isDevice
                }, r(t)) e = t;
            else {
                ENV["LD_LIBRARY_PATH"] && (n = ENV["LD_LIBRARY_PATH"].split(":"));
                for (_ in n)
                    if (o = PATH.join2(n[_], t), r(o)) {
                        e = o;
                        break
                    }
            }
            if (DLFCN.loadedLibNames[e]) return a = DLFCN.loadedLibNames[e], DLFCN.loadedLibs[a].refcount++, a;
            if ("__self__" === e) a = -1, l = Module;
            else {
                if (undefined !== Module["preloadedWasm"] && undefined !== Module["preloadedWasm"][e]) l = Module["preloadedWasm"][e];
                else {
                    if (u = FS.findObject(e), !u || u.isFolder || u.isDevice) return DLFCN.errorMsg = "Could not find dynamic lib: " + e, 0;
                    FS.forceLoadFile(u);
                    try {
                        s = FS.readFile(e, {
                            encoding: "binary"
                        }), s instanceof Uint8Array || (s = new Uint8Array(s)), l = loadWebAssemblyModule(s)
                    } catch (f) {
                        return DLFCN.errorMsg = "Could not evaluate dynamic lib: " + e + "\n" + f, 0
                    }
                }
                a = 1;
                for (c in DLFCN.loadedLibs) DLFCN.loadedLibs.hasOwnProperty(c) && a++;
                if (256 & i)
                    for (_ in l) l.hasOwnProperty(_) && "_" == _[0] && (Module[_] = l[_])
            }
            return DLFCN.loadedLibs[a] = {
                refcount: 1,
                name: e,
                module: l
            }, DLFCN.loadedLibNames[e] = a, a
        }

        function _dlsym(e, i) {
            var n, t;
            return i = Pointer_stringify(i), DLFCN.loadedLibs[e] ? (n = DLFCN.loadedLibs[e], i = "_" + i, n.module.hasOwnProperty(i) ? (t = n.module[i], "function" == typeof t ? addFunction(t) : t) : (DLFCN.errorMsg = 'Tried to lookup unknown symbol "' + i + '" in dynamic lib: ' + n.name, 0)) : (DLFCN.errorMsg = "Tried to dlsym() from an unopened handle: " + e, 0)
        }

        function _emscripten_set_main_loop_timing(e, i) {
            function n(e) {
                (e.data === r || e.data.target === r) && (e.stopPropagation(), t.shift()())
            }
            var t, r;
            return Browser.mainLoop.timingMode = e, Browser.mainLoop.timingValue = i, Browser.mainLoop.func ? (0 == e ? (Browser.mainLoop.scheduler = function _() {
                var e = 0 | Math.max(0, Browser.mainLoop.tickStartTime + i - _emscripten_get_now());
                setTimeout(Browser.mainLoop.runner, e)
            }, Browser.mainLoop.method = "timeout") : 1 == e ? (Browser.mainLoop.scheduler = function o() {
                Browser.requestAnimationFrame(Browser.mainLoop.runner)
            }, Browser.mainLoop.method = "rAF") : 2 == e && ("undefined" == typeof setImmediate && (t = [], r = "setimmediate", addEventListener("message", n, !0), setImmediate = function a(e) {
                t.push(e), ENVIRONMENT_IS_WORKER ? (undefined === Module["setImmediates"] && (Module["setImmediates"] = []), Module["setImmediates"].push(e), postMessage({
                    target: r
                })) : postMessage(r, "*")
            }), Browser.mainLoop.scheduler = function l() {
                setImmediate(Browser.mainLoop.runner)
            }, Browser.mainLoop.method = "immediate"), 0) : 1
        }

        function _emscripten_set_main_loop(e, i, n, t, r) {
            var _, o;
            if (Module["noExitRuntime"] = !0, assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."), Browser.mainLoop.func = e, Browser.mainLoop.arg = t, _ = "undefined" != typeof t ? function() {
                    Module["dynCall_vi"](e, t)
                } : function() {
                    Module["dynCall_v"](e)
                }, o = Browser.mainLoop.currentlyRunningMainloop, Browser.mainLoop.runner = function a() {
                    var e, i, n, t;
                    if (!ABORT) {
                        if (Browser.mainLoop.queue.length > 0) {
                            if (e = Date.now(), i = Browser.mainLoop.queue.shift(), i.func(i.arg), Browser.mainLoop.remainingBlockers && (n = Browser.mainLoop.remainingBlockers, t = n % 1 == 0 ? n - 1 : Math.floor(n), i.counted ? Browser.mainLoop.remainingBlockers = t : (t += .5, Browser.mainLoop.remainingBlockers = (8 * n + t) / 9)), console.log('main loop blocker "' + i.name + '" took ' + (Date.now() - e) + " ms"), Browser.mainLoop.updateStatus(), o < Browser.mainLoop.currentlyRunningMainloop) return;
                            return setTimeout(Browser.mainLoop.runner, 0), undefined
                        }
                        if (!(o < Browser.mainLoop.currentlyRunningMainloop)) {
                            if (Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0, 1 == Browser.mainLoop.timingMode && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) return Browser.mainLoop.scheduler(), undefined;
                            0 == Browser.mainLoop.timingMode && (Browser.mainLoop.tickStartTime = _emscripten_get_now()), "timeout" === Browser.mainLoop.method && Module.ctx && (err("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!"), Browser.mainLoop.method = ""), Browser.mainLoop.runIter(_), o < Browser.mainLoop.currentlyRunningMainloop || ("object" == typeof SDL && SDL.audio && SDL.audio.queueNewAudioData && SDL.audio.queueNewAudioData(), Browser.mainLoop.scheduler())
                        }
                    }
                }, r || (i && i > 0 ? _emscripten_set_main_loop_timing(0, 1e3 / i) : _emscripten_set_main_loop_timing(1, 1), Browser.mainLoop.scheduler()), n) throw "SimulateInfiniteLoop"
        }

        function _emscripten_cancel_main_loop() {
            Browser.mainLoop.pause(), Browser.mainLoop.func = null
        }

        function _emscripten_set_canvas_element_size_calling_thread(e, i, n) {
            var t, r, _ = JSEvents.findCanvasEventTarget(e);
            return _ ? (_.canvasSharedPtr && (HEAP32[_.canvasSharedPtr >> 2] = i, HEAP32[_.canvasSharedPtr + 4 >> 2] = n), !_.offscreenCanvas && _.controlTransferredOffscreen ? -4 : (_.offscreenCanvas && (_ = _.offscreenCanvas), t = !1, _.GLctxObject && _.GLctxObject.GLctx && (r = _.GLctxObject.GLctx.getParameter(_.GLctxObject.GLctx.VIEWPORT), t = 0 === r[0] && 0 === r[1] && r[2] === _.width && r[3] === _.height), _.width = i, _.height = n, t && _.GLctxObject.GLctx.viewport(0, 0, i, n), 0)) : -4
        }

        function _emscripten_set_canvas_element_size_main_thread(e, i, n) {
            return _emscripten_set_canvas_element_size_calling_thread(e, i, n)
        }

        function _emscripten_set_canvas_element_size(e, i, n) {
            var t = JSEvents.findCanvasEventTarget(e);
            return t ? _emscripten_set_canvas_element_size_calling_thread(e, i, n) : _emscripten_set_canvas_element_size_main_thread(e, i, n)
        }

        function emscripten_set_canvas_element_size_js(e, i, n) {
            var t, r, _;
            return "string" == typeof e ? (t = stackSave(), r = stackAlloc(e.length + 1), stringToUTF8(e, r, e.length + 1), _ = _emscripten_set_canvas_element_size(r, i, n), stackRestore(t), _) : _emscripten_set_canvas_element_size(e, i, n)
        }

        function _emscripten_get_canvas_element_size_calling_thread(e, i, n) {
            var t, r, _ = JSEvents.findCanvasEventTarget(e);
            if (!_) return -4;
            if (_.canvasSharedPtr) t = HEAP32[_.canvasSharedPtr >> 2], r = HEAP32[_.canvasSharedPtr + 4 >> 2], HEAP32[i >> 2] = t, HEAP32[n >> 2] = r;
            else if (_.offscreenCanvas) HEAP32[i >> 2] = _.offscreenCanvas.width, HEAP32[n >> 2] = _.offscreenCanvas.height;
            else {
                if (_.controlTransferredOffscreen) return -4;
                HEAP32[i >> 2] = _.width, HEAP32[n >> 2] = _.height
            }
            return 0
        }

        function _emscripten_get_canvas_element_size_main_thread(e, i, n) {
            return _emscripten_get_canvas_element_size_calling_thread(e, i, n)
        }

        function _emscripten_get_canvas_element_size(e, i, n) {
            var t = JSEvents.findCanvasEventTarget(e);
            return t ? _emscripten_get_canvas_element_size_calling_thread(e, i, n) : _emscripten_get_canvas_element_size_main_thread(e, i, n)
        }

        function emscripten_get_canvas_element_size_js(e) {
            var i, n, t, r = stackSave(),
                _ = stackAlloc(8),
                o = _ + 4;
            return "string" == typeof e && (i = stackAlloc(e.length + 1), stringToUTF8(e, i, e.length + 1), e = i), n = _emscripten_get_canvas_element_size(e, _, o), t = [HEAP32[_ >> 2], HEAP32[o >> 2]], stackRestore(r), t
        }

        function _emscripten_exit_fullscreen() {
            if ("undefined" == typeof JSEvents.fullscreenEnabled()) return -1;
            if (JSEvents.removeDeferredCalls(JSEvents.requestFullscreen), document.exitFullscreen) document.exitFullscreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else {
                if (!document.webkitExitFullscreen) return -1;
                document.webkitExitFullscreen()
            }
            return __currentFullscreenStrategy.canvasResizedCallback && Module["dynCall_iiii"](__currentFullscreenStrategy.canvasResizedCallback, 37, 0, __currentFullscreenStrategy.canvasResizedCallbackUserData), 0
        }

        function _emscripten_exit_pointerlock() {
            if (JSEvents.removeDeferredCalls(JSEvents.requestPointerLock), document.exitPointerLock) document.exitPointerLock();
            else if (document.msExitPointerLock) document.msExitPointerLock();
            else if (document.mozExitPointerLock) document.mozExitPointerLock();
            else {
                if (!document.webkitExitPointerLock) return -1;
                document.webkitExitPointerLock()
            }
            return 0
        }

        function _emscripten_get_fullscreen_status(e) {
            return "undefined" == typeof JSEvents.fullscreenEnabled() ? -1 : (JSEvents.fillFullscreenChangeEventData(e), 0)
        }

        function __emscripten_sample_gamepad_data() {
            JSEvents.numGamepadsConnected && (Browser.mainLoop.currentFrameNumber === JSEvents.lastGamepadStateFrame && Browser.mainLoop.currentFrameNumber || (JSEvents.lastGamepadState = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : null,
                JSEvents.lastGamepadStateFrame = Browser.mainLoop.currentFrameNumber))
        }

        function _emscripten_get_gamepad_status(e, i) {
            return __emscripten_sample_gamepad_data(), JSEvents.lastGamepadState ? 0 > e || e >= JSEvents.lastGamepadState.length ? -5 : JSEvents.lastGamepadState[e] ? (JSEvents.fillGamepadEventData(i, JSEvents.lastGamepadState[e]), 0) : -7 : -1
        }

        function _emscripten_get_main_loop_timing(e, i) {
            e && (HEAP32[e >> 2] = Browser.mainLoop.timingMode), i && (HEAP32[i >> 2] = Browser.mainLoop.timingValue)
        }

        function _emscripten_get_num_gamepads() {
            return JSEvents.numGamepadsConnected ? (__emscripten_sample_gamepad_data(), JSEvents.lastGamepadState ? JSEvents.lastGamepadState.length : -1) : 0
        }

        function _emscripten_has_threading_support() {
            return 0
        }

        function _emscripten_html5_remove_all_event_listeners() {
            JSEvents.removeAllEventListeners()
        }

        function _emscripten_is_webgl_context_lost(e) {
            return Module.ctx ? Module.ctx.isContextLost() : !0
        }

        function __reallyNegative(e) {
            return 0 > e || 0 === e && 1 / e === -(1 / 0)
        }

        function __formatString(e, i) {
            function n(e, i) {
                return "double" === i || "i64" === i ? 7 & e && (assert(4 === (7 & e)), e += 4) : assert(0 === (3 & e)), e
            }

            function t(e) {
                var i;
                return _ = n(_, e), "double" === e ? (i = HEAPF64[_ >> 3], _ += 8) : "i64" == e ? (i = [HEAP32[_ >> 2], HEAP32[_ + 4 >> 2]], _ += 8) : (assert(0 === (3 & _)), e = "i32", i = HEAP32[_ >> 2], _ += 4), i
            }
            var r, _, o, a, l, u, s, c, f, d, p, m, v, y, g, S, L, E, h, b, C, M, k, A, w, G, O, R, I, j, B, T, F, P;
            assert(0 === (3 & i)), r = e, _ = i, o = [];
            while (1) {
                if (s = r, a = HEAP8[r >> 0], 0 === a) break;
                if (l = HEAP8[r + 1 >> 0], 37 == a) {
                    c = !1, f = !1, d = !1, p = !1, m = !1;
                    e: while (1) {
                        switch (l) {
                            case 43:
                                c = !0;
                                break;
                            case 45:
                                f = !0;
                                break;
                            case 35:
                                d = !0;
                                break;
                            case 48:
                                if (p) break e;
                                p = !0;
                                break;
                            case 32:
                                m = !0;
                                break;
                            default:
                                break e
                        }
                        r++, l = HEAP8[r + 1 >> 0]
                    }
                    if (v = 0, 42 == l) v = t("i32"), r++, l = HEAP8[r + 1 >> 0];
                    else
                        while (l >= 48 && 57 >= l) v = 10 * v + (l - 48), r++, l = HEAP8[r + 1 >> 0];
                    if (y = !1, g = -1, 46 == l) {
                        if (g = 0, y = !0, r++, l = HEAP8[r + 1 >> 0], 42 == l) g = t("i32"), r++;
                        else
                            while (1) {
                                if (S = HEAP8[r + 1 >> 0], 48 > S || S > 57) break;
                                g = 10 * g + (S - 48), r++
                            }
                        l = HEAP8[r + 1 >> 0]
                    }
                    switch (0 > g && (g = 6, y = !1), String.fromCharCode(l)) {
                        case "h":
                            E = HEAP8[r + 2 >> 0], 104 == E ? (r++, L = 1) : L = 2;
                            break;
                        case "l":
                            E = HEAP8[r + 2 >> 0], 108 == E ? (r++, L = 8) : L = 4;
                            break;
                        case "L":
                        case "q":
                        case "j":
                            L = 8;
                            break;
                        case "z":
                        case "t":
                        case "I":
                            L = 4;
                            break;
                        default:
                            L = null
                    }
                    switch (L && r++, l = HEAP8[r + 1 >> 0], String.fromCharCode(l)) {
                        case "d":
                        case "i":
                        case "u":
                        case "o":
                        case "x":
                        case "X":
                        case "p":
                            if (h = 100 == l || 105 == l, L = L || 4, u = t("i" + 8 * L), b = u, 8 == L && (u = makeBigInt(u[0], u[1], 117 == l)), 4 >= L && (M = Math.pow(256, L) - 1, u = (h ? reSign : unSign)(u & M, 8 * L)), k = Math.abs(u), A = "", 100 == l || 105 == l) C = 8 == L && "object" == typeof i64Math ? i64Math.stringify(b[0], b[1], null) : reSign(u, 8 * L, 1).toString(10);
                            else if (117 == l) C = 8 == L && "object" == typeof i64Math ? i64Math.stringify(b[0], b[1], !0) : unSign(u, 8 * L, 1).toString(10), u = Math.abs(u);
                            else if (111 == l) C = (d ? "0" : "") + k.toString(8);
                            else if (120 == l || 88 == l) {
                                if (A = d && 0 != u ? "0x" : "", 8 == L && "object" == typeof i64Math)
                                    if (b[1]) {
                                        C = (b[1] >>> 0).toString(16), w = (b[0] >>> 0).toString(16);
                                        while (w.length < 8) w = "0" + w;
                                        C += w
                                    } else C = (b[0] >>> 0).toString(16);
                                else if (0 > u) {
                                    for (u = -u, C = (k - 1).toString(16), G = [], O = 0; O < C.length; O++) G.push((15 - parseInt(C[O], 16)).toString(16));
                                    C = G.join("");
                                    while (C.length < 2 * L) C = "f" + C
                                } else C = k.toString(16);
                                88 == l && (A = A.toUpperCase(), C = C.toUpperCase())
                            } else 112 == l && (0 === k ? C = "(nil)" : (A = "0x", C = k.toString(16)));
                            if (y)
                                while (C.length < g) C = "0" + C;
                            u >= 0 && (c ? A = "+" + A : m && (A = " " + A)), "-" == C.charAt(0) && (A = "-" + A, C = C.substr(1));
                            while (A.length + C.length < v) f ? C += " " : p ? C = "0" + C : A = " " + A;
                            C = A + C, C.split("").forEach(function(e) {
                                o.push(e.charCodeAt(0))
                            });
                            break;
                        case "f":
                        case "F":
                        case "e":
                        case "E":
                        case "g":
                        case "G":
                            if (u = t("double"), isNaN(u)) C = "nan", p = !1;
                            else if (isFinite(u)) {
                                if (R = !1, I = Math.min(g, 20), (103 == l || 71 == l) && (R = !0, g = g || 1, j = parseInt(u.toExponential(I).split("e")[1], 10), g > j && j >= -4 ? (l = (103 == l ? "f" : "F").charCodeAt(0), g -= j + 1) : (l = (103 == l ? "e" : "E").charCodeAt(0), g--), I = Math.min(g, 20)), 101 == l || 69 == l ? (C = u.toExponential(I), /[eE][-+]\d$/.test(C) && (C = C.slice(0, -1) + "0" + C.slice(-1))) : (102 == l || 70 == l) && (C = u.toFixed(I), 0 === u && __reallyNegative(u) && (C = "-" + C)), B = C.split("e"), R && !d)
                                    while (B[0].length > 1 && B[0].indexOf(".") != -1 && ("0" == B[0].slice(-1) || "." == B[0].slice(-1))) B[0] = B[0].slice(0, -1);
                                else {
                                    d && C.indexOf(".") == -1 && (B[0] += ".");
                                    while (g > I++) B[0] += "0"
                                }
                                C = B[0] + (B.length > 1 ? "e" + B[1] : ""), 69 == l && (C = C.toUpperCase()), u >= 0 && (c ? C = "+" + C : m && (C = " " + C))
                            } else C = (0 > u ? "-" : "") + "inf", p = !1;
                            while (C.length < v) f ? C += " " : C = !p || "-" != C[0] && "+" != C[0] ? (p ? "0" : " ") + C : C[0] + "0" + C.slice(1);
                            97 > l && (C = C.toUpperCase()), C.split("").forEach(function(e) {
                                o.push(e.charCodeAt(0))
                            });
                            break;
                        case "s":
                            if (T = t("i8*"), F = T ? _strlen(T) : "(null)".length, y && (F = Math.min(F, g)), !f)
                                while (F < v--) o.push(32);
                            if (T)
                                for (O = 0; F > O; O++) o.push(HEAPU8[T++ >> 0]);
                            else o = o.concat(intArrayFromString("(null)".substr(0, F), !0));
                            if (f)
                                while (F < v--) o.push(32);
                            break;
                        case "c":
                            f && o.push(t("i8"));
                            while (--v > 0) o.push(32);
                            f || o.push(t("i8"));
                            break;
                        case "n":
                            P = t("i32*"), HEAP32[P >> 2] = o.length;
                            break;
                        case "%":
                            o.push(a);
                            break;
                        default:
                            for (O = s; r + 2 > O; O++) o.push(HEAP8[O >> 0])
                    }
                    r += 2
                } else o.push(a), r += 1
            }
            return o
        }

        function __emscripten_traverse_stack(e) {
            var i, n, t, r, _, o, a;
            if (!e || !e.callee || !e.callee.name) return [null, "", ""];
            i = e.callee.toString(), n = e.callee.name, t = "(", r = !0;
            for (_ in e) o = e[_], r || (t += ", "), r = !1, t += "number" == typeof o || "string" == typeof o ? o : "(" + typeof o + ")";
            return t += ")", a = e.callee.caller, e = a ? a.arguments : [], r && (t = ""), [e, n, t]
        }

        function _emscripten_get_callstack_js(e) {
            var i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v = jsStackTrace(),
                y = v.lastIndexOf("_emscripten_log"),
                g = v.lastIndexOf("_emscripten_get_callstack"),
                S = v.indexOf("\n", Math.max(y, g)) + 1;
            if (v = v.slice(S), 8 & e && "undefined" == typeof emscripten_source_map && (warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.'), e ^= 8, e |= 16), i = null, 128 & e) {
                i = __emscripten_traverse_stack(arguments);
                while (i[1].indexOf("_emscripten_") >= 0) i = __emscripten_traverse_stack(i[0])
            }
            n = v.split("\n"), v = "", t = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"), r = new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?"), _ = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");
            for (o in n) {
                if (a = n[o], l = "", u = "", s = 0, c = 0, f = _.exec(a), f && 5 == f.length) l = f[1], u = f[2], s = f[3], c = f[4];
                else {
                    if (f = t.exec(a), f || (f = r.exec(a)), !(f && f.length >= 4)) {
                        v += a + "\n";
                        continue
                    }
                    l = f[1], u = f[2], s = f[3], c = 0 | f[4]
                }
                d = 32 & e ? demangle(l) : l, d || (d = l), p = !1, 8 & e && (m = emscripten_source_map.originalPositionFor({
                    line: s,
                    column: c
                }), p = m && m.source, p && (64 & e && (m.source = m.source.substring(m.source.replace(/\\/g, "/").lastIndexOf("/") + 1)), v += "    at " + d + " (" + m.source + ":" + m.line + ":" + m.column + ")\n")), (16 & e || !p) && (64 & e && (u = u.substring(u.replace(/\\/g, "/").lastIndexOf("/") + 1)), v += (p ? "     = " + l : "    at " + d) + " (" + u + ":" + s + ":" + c + ")\n"), 128 & e && i[0] && (i[1] == l && i[2].length > 0 && (v = v.replace(/\s+$/, ""), v += " with values: " + i[1] + i[2] + "\n"), i = __emscripten_traverse_stack(i[0]))
            }
            return v = v.replace(/\s+$/, ""), v
        }

        function _emscripten_log_js(e, i) {
            24 & e && (i = i.replace(/\s+$/, ""), i += (i.length > 0 ? "\n" : "") + _emscripten_get_callstack_js(e)), 1 & e ? 4 & e ? console.error(i) : 2 & e ? console.warn(i) : console.log(i) : 6 & e ? err(i) : out(i)
        }

        function _emscripten_log(e, i) {
            var n, t, r, _ = HEAP32[i >> 2];
            if (i += 4, n = "", _)
                for (t = __formatString(_, i), r = 0; r < t.length; ++r) n += String.fromCharCode(t[r]);
            _emscripten_log_js(e, n)
        }

        function _longjmp(e, i) {
            throw Module["setThrew"](e, i || 1), "longjmp"
        }

        function _emscripten_longjmp(e, i) {
            _longjmp(e, i)
        }

        function _emscripten_num_logical_cores() {
            return 1
        }

        function __setLetterbox(e, i, n) {
            JSEvents.isInternetExplorer() ? (e.style.marginLeft = e.style.marginRight = n + "px", e.style.marginTop = e.style.marginBottom = i + "px") : (e.style.paddingLeft = e.style.paddingRight = n + "px", e.style.paddingTop = e.style.paddingBottom = i + "px")
        }

        function __emscripten_do_request_fullscreen(e, i) {
            if ("undefined" == typeof JSEvents.fullscreenEnabled()) return -1;
            if (!JSEvents.fullscreenEnabled()) return -3;
            if (e || (e = "#canvas"), e = JSEvents.findEventTarget(e), !e) return -4;
            if (!(e.requestFullscreen || e.msRequestFullscreen || e.mozRequestFullScreen || e.mozRequestFullscreen || e.webkitRequestFullscreen)) return -3;
            var n = JSEvents.canPerformEventHandlerRequests();
            return n ? JSEvents.requestFullscreen(e, i) : i.deferUntilInEventHandler ? (JSEvents.deferCall(JSEvents.requestFullscreen, 1, [e, i]), 1) : -2
        }

        function _emscripten_request_fullscreen(e, i) {
            var n = {};
            return n.scaleMode = 0, n.canvasResolutionScaleMode = 0, n.filteringMode = 0, n.deferUntilInEventHandler = i, n.canvasResizedCallbackTargetThread = 2, __emscripten_do_request_fullscreen(e, n)
        }

        function _emscripten_request_pointerlock(e, i) {
            if (e || (e = "#canvas"), e = JSEvents.findEventTarget(e), !e) return -4;
            if (!(e.requestPointerLock || e.mozRequestPointerLock || e.webkitRequestPointerLock || e.msRequestPointerLock)) return -1;
            var n = JSEvents.canPerformEventHandlerRequests();
            return n ? JSEvents.requestPointerLock(e) : i ? (JSEvents.deferCall(JSEvents.requestPointerLock, 2, [e]), 1) : -2
        }

        function _emscripten_set_blur_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerFocusEventCallback(e, i, n, t, 12, "blur", r), 0
        }

        function _emscripten_set_dblclick_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerMouseEventCallback(e, i, n, t, 7, "dblclick", r), 0
        }

        function _emscripten_set_devicemotion_callback_on_thread(e, i, n, t) {
            return JSEvents.registerDeviceMotionEventCallback(window, e, i, n, 17, "devicemotion", t), 0
        }

        function _emscripten_set_deviceorientation_callback_on_thread(e, i, n, t) {
            return JSEvents.registerDeviceOrientationEventCallback(window, e, i, n, 16, "deviceorientation", t), 0
        }

        function _emscripten_set_focus_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerFocusEventCallback(e, i, n, t, 13, "focus", r), 0
        }

        function _emscripten_set_fullscreenchange_callback_on_thread(e, i, n, t, r) {
            if ("undefined" == typeof JSEvents.fullscreenEnabled()) return -1;
            if (e) {
                if (e = JSEvents.findEventTarget(e), !e) return -4
            } else e = document;
            return JSEvents.registerFullscreenChangeEventCallback(e, i, n, t, 19, "fullscreenchange", r), JSEvents.registerFullscreenChangeEventCallback(e, i, n, t, 19, "mozfullscreenchange", r), JSEvents.registerFullscreenChangeEventCallback(e, i, n, t, 19, "webkitfullscreenchange", r), JSEvents.registerFullscreenChangeEventCallback(e, i, n, t, 19, "msfullscreenchange", r), 0
        }

        function _emscripten_set_gamepadconnected_callback_on_thread(e, i, n, t) {
            return navigator.getGamepads || navigator.webkitGetGamepads ? (JSEvents.registerGamepadEventCallback(window, e, i, n, 26, "gamepadconnected", t), 0) : -1
        }

        function _emscripten_set_gamepaddisconnected_callback_on_thread(e, i, n, t) {
            return navigator.getGamepads || navigator.webkitGetGamepads ? (JSEvents.registerGamepadEventCallback(window, e, i, n, 27, "gamepaddisconnected", t), 0) : -1
        }

        function _emscripten_set_keydown_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerKeyEventCallback(e, i, n, t, 2, "keydown", r), 0
        }

        function _emscripten_set_keypress_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerKeyEventCallback(e, i, n, t, 1, "keypress", r), 0
        }

        function _emscripten_set_keyup_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerKeyEventCallback(e, i, n, t, 3, "keyup", r), 0
        }

        function _emscripten_set_mousedown_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerMouseEventCallback(e, i, n, t, 5, "mousedown", r), 0
        }

        function _emscripten_set_mousemove_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerMouseEventCallback(e, i, n, t, 8, "mousemove", r), 0
        }

        function _emscripten_set_mouseup_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerMouseEventCallback(e, i, n, t, 6, "mouseup", r), 0
        }

        function _emscripten_set_touchcancel_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerTouchEventCallback(e, i, n, t, 25, "touchcancel", r), 0
        }

        function _emscripten_set_touchend_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerTouchEventCallback(e, i, n, t, 23, "touchend", r), 0
        }

        function _emscripten_set_touchmove_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerTouchEventCallback(e, i, n, t, 24, "touchmove", r), 0
        }

        function _emscripten_set_touchstart_callback_on_thread(e, i, n, t, r) {
            return JSEvents.registerTouchEventCallback(e, i, n, t, 22, "touchstart", r), 0
        }

        function _emscripten_set_wheel_callback_on_thread(e, i, n, t, r) {
            return e = JSEvents.findEventTarget(e), "undefined" != typeof e.onwheel ? (JSEvents.registerWheelEventCallback(e, i, n, t, 9, "wheel", r), 0) : "undefined" != typeof e.onmousewheel ? (JSEvents.registerWheelEventCallback(e, i, n, t, 9, "mousewheel", r), 0) : -1
        }

        function _emscripten_webgl_do_create_context(e, i) {
            var n, t, r = {};
            return r["alpha"] = !!HEAP32[i >> 2], r["depth"] = !!HEAP32[i + 4 >> 2], r["stencil"] = !!HEAP32[i + 8 >> 2], r["antialias"] = !!HEAP32[i + 12 >> 2], r["premultipliedAlpha"] = !!HEAP32[i + 16 >> 2], r["preserveDrawingBuffer"] = !!HEAP32[i + 20 >> 2], r["preferLowPowerToHighPerformance"] = !!HEAP32[i + 24 >> 2], r["failIfMajorPerformanceCaveat"] = !!HEAP32[i + 28 >> 2], r["majorVersion"] = HEAP32[i + 32 >> 2], r["minorVersion"] = HEAP32[i + 36 >> 2], r["explicitSwapControl"] = HEAP32[i + 44 >> 2], r["proxyContextToMainThread"] = HEAP32[i + 48 >> 2], r["renderViaOffscreenBackBuffer"] = HEAP32[i + 52 >> 2], e = Pointer_stringify(e), n = e && "#canvas" !== e || !Module["canvas"] ? GL.offscreenCanvases[e] ? GL.offscreenCanvases[e].offscreenCanvas : JSEvents.findEventTarget(e) : Module["canvas"].id && GL.offscreenCanvases[Module["canvas"].id] ? GL.offscreenCanvases[Module["canvas"].id].offscreenCanvas || JSEvents.findEventTarget(Module["canvas"].id) : Module["canvas"], n ? r["explicitSwapControl"] ? 0 : (t = GL.createContext(n, r), t) : 0
        }

        function _emscripten_webgl_create_context() {
            return _emscripten_webgl_do_create_context.apply(null, arguments)
        }

        function _emscripten_webgl_destroy_context_calling_thread(e) {
            GL.deleteContext(e)
        }

        function _emscripten_webgl_destroy_context() {
            return _emscripten_webgl_destroy_context_calling_thread.apply(null, arguments)
        }

        function _emscripten_webgl_enable_extension_calling_thread(e, i) {
            var n, t = GL.getContext(e),
                r = Pointer_stringify(i);
            return 0 == r.indexOf("GL_") && (r = r.substr(3)), n = t.GLctx.getExtension(r), n ? 1 : 0
        }

        function _emscripten_webgl_enable_extension() {
            return _emscripten_webgl_enable_extension_calling_thread.apply(null, arguments)
        }

        function _emscripten_webgl_do_get_current_context() {
            return GL.currentContext ? GL.currentContext.handle : 0
        }

        function _emscripten_webgl_get_current_context() {
            return _emscripten_webgl_do_get_current_context.apply(null, arguments)
        }

        function _emscripten_webgl_init_context_attributes(e) {
            HEAP32[e >> 2] = 1, HEAP32[e + 4 >> 2] = 1, HEAP32[e + 8 >> 2] = 0, HEAP32[e + 12 >> 2] = 1, HEAP32[e + 16 >> 2] = 1, HEAP32[e + 20 >> 2] = 0, HEAP32[e + 24 >> 2] = 0, HEAP32[e + 28 >> 2] = 0, HEAP32[e + 32 >> 2] = 1, HEAP32[e + 36 >> 2] = 0, HEAP32[e + 40 >> 2] = 1, HEAP32[e + 44 >> 2] = 0, HEAP32[e + 48 >> 2] = 0, HEAP32[e + 52 >> 2] = 0
        }

        function _emscripten_webgl_make_context_current(e) {
            var i = GL.makeContextCurrent(e);
            return i ? 0 : -5
        }

        function __exit(e) {
            exit(e)
        }

        function _exit(e) {
            __exit(e)
        }

        function _flock(e, i) {
            return 0
        }

        function _getaddrinfo(e, i, n, t) {
            function r(e, i, n, t, r, _) {
                var o, a, l, u = 10 === e ? 28 : 16;
                return r = 10 === e ? __inet_ntop6_raw(r) : __inet_ntop4_raw(r), o = _malloc(u), l = __write_sockaddr(o, e, r, _), assert(!l.errno), a = _malloc(32), HEAP32[a + 4 >> 2] = e, HEAP32[a + 8 >> 2] = i, HEAP32[a + 12 >> 2] = n, HEAP32[a + 24 >> 2] = t, HEAP32[a + 20 >> 2] = o, 10 === e ? HEAP32[a + 16 >> 2] = 28 : HEAP32[a + 16 >> 2] = 16, HEAP32[a + 28 >> 2] = 0, a
            }
            var _, o = 0,
                a = 0,
                l = 0,
                u = 0,
                s = 0,
                c = 0;
            if (n && (l = HEAP32[n >> 2], u = HEAP32[n + 4 >> 2], s = HEAP32[n + 8 >> 2], c = HEAP32[n + 12 >> 2]), s && !c && (c = 2 === s ? 17 : 6), !s && c && (s = 17 === c ? 2 : 1), 0 === c && (c = 6), 0 === s && (s = 1), !e && !i) return -2;
            if (l & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) return -1;
            if (0 !== n && 2 & HEAP32[n >> 2] && !e) return -1;
            if (32 & l) return -2;
            if (0 !== s && 1 !== s && 2 !== s) return -7;
            if (0 !== u && 2 !== u && 10 !== u) return -6;
            if (i && (i = Pointer_stringify(i), a = parseInt(i, 10), isNaN(a))) return 1024 & l ? -2 : -8;
            if (!e) return 0 === u && (u = 2), 0 === (1 & l) && (o = 2 === u ? _htonl(2130706433) : [0, 0, 0, 1]), _ = r(u, s, c, null, o, a), HEAP32[t >> 2] = _, 0;
            if (e = Pointer_stringify(e), o = __inet_pton4_raw(e), null !== o)
                if (0 === u || 2 === u) u = 2;
                else {
                    if (!(10 === u && 8 & l)) return -2;
                    o = [0, 0, _htonl(65535), o], u = 10
                }
            else if (o = __inet_pton6_raw(e), null !== o) {
                if (0 !== u && 10 !== u) return -2;
                u = 10
            }
            return null != o ? (_ = r(u, s, c, e, o, a), HEAP32[t >> 2] = _, 0) : 4 & l ? -2 : (e = DNS.lookup_name(e), o = __inet_pton4_raw(e), 0 === u ? u = 2 : 10 === u && (o = [0, 0, _htonl(65535), o]), _ = r(u, s, c, null, o, a), HEAP32[t >> 2] = _, 0)
        }

        function _getenv(e) {
            return 0 === e ? 0 : (e = Pointer_stringify(e), ENV.hasOwnProperty(e) ? (_getenv.ret && _free(_getenv.ret), _getenv.ret = allocateUTF8(ENV[e]), _getenv.ret) : 0)
        }

        function _gethostbyname(e) {
            var i, n, t, r, _;
            return e = Pointer_stringify(e), i = _malloc(20), n = _malloc(e.length + 1), stringToUTF8(e, n, e.length + 1), HEAP32[i >> 2] = n, t = _malloc(4), HEAP32[t >> 2] = 0, HEAP32[i + 4 >> 2] = t, r = 2, HEAP32[i + 8 >> 2] = r, HEAP32[i + 12 >> 2] = 4, _ = _malloc(12), HEAP32[_ >> 2] = _ + 8, HEAP32[_ + 4 >> 2] = 0, HEAP32[_ + 8 >> 2] = __inet_pton4_raw(DNS.lookup_name(e)), HEAP32[i + 16 >> 2] = _, i
        }

        function _gethostbyaddr(e, i, n) {
            var t, r, _;
            return 2 !== n ? (___setErrNo(ERRNO_CODES.EAFNOSUPPORT), null) : (e = HEAP32[e >> 2], t = __inet_ntop4_raw(e), r = DNS.lookup_addr(t), r && (t = r), _ = allocate(intArrayFromString(t), "i8", ALLOC_STACK), _gethostbyname(_))
        }

        function _getnameinfo(e, i, n, t, r, _, o) {
            var a, l, u, s, c, f = __read_sockaddr(e, i);
            if (f.errno) return -6;
            if (a = f.port, l = f.addr, u = !1, n && t) {
                if (1 & o || !(s = DNS.lookup_addr(l))) {
                    if (8 & o) return -2
                } else l = s;
                c = stringToUTF8(l, n, t), c + 1 >= t && (u = !0)
            }
            return r && _ && (a = "" + a, c = stringToUTF8(a, r, _), c + 1 >= _ && (u = !0)), u ? -12 : 0
        }

        function _getpwuid(e) {
            return 0
        }

        function _gettimeofday(e) {
            var i = Date.now();
            return HEAP32[e >> 2] = i / 1e3 | 0, HEAP32[e + 4 >> 2] = i % 1e3 * 1e3 | 0, 0
        }

        function _glActiveTexture(e) {
            GLctx["activeTexture"](e)
        }

        function _glAttachShader(e, i) {
            GLctx.attachShader(GL.programs[e], GL.shaders[i])
        }

        function _glBeginQuery(e, i) {
            GLctx["beginQuery"](e, i ? GL.queries[i] : null)
        }

        function _glBeginTransformFeedback(e) {
            GLctx["beginTransformFeedback"](e)
        }

        function _glBindAttribLocation(e, i, n) {
            n = Pointer_stringify(n), GLctx.bindAttribLocation(GL.programs[e], i, n)
        }

        function _glBindBuffer(e, i) {
            var n = i ? GL.buffers[i] : null;
            35051 == e ? GLctx.currentPixelPackBufferBinding = i : 35052 == e && (GLctx.currentPixelUnpackBufferBinding = i), GLctx.bindBuffer(e, n)
        }

        function _glBindBufferBase(e, i, n) {
            var t = n ? GL.buffers[n] : null;
            GLctx["bindBufferBase"](e, i, t)
        }

        function _glBindBufferRange(e, i, n, t, r) {
            var _ = n ? GL.buffers[n] : null;
            GLctx["bindBufferRange"](e, i, _, t, r)
        }

        function _glBindFramebuffer(e, i) {
            GLctx.bindFramebuffer(e, i ? GL.framebuffers[i] : null)
        }

        function _glBindRenderbuffer(e, i) {
            GLctx.bindRenderbuffer(e, i ? GL.renderbuffers[i] : null)
        }

        function _glBindSampler(e, i) {
            GLctx["bindSampler"](e, i ? GL.samplers[i] : null)
        }

        function _glBindTexture(e, i) {
            GLctx.bindTexture(e, i ? GL.textures[i] : null)
        }

        function _glBindTransformFeedback(e, i) {
            var n = i ? GL.transformFeedbacks[i] : null;
            return i && !n ? (GL.recordError(1282), undefined) : (GLctx["bindTransformFeedback"](e, n), undefined)
        }

        function _glBindVertexArray(e) {
            GLctx["bindVertexArray"](GL.vaos[e])
        }

        function _glBlendEquation(e) {
            GLctx["blendEquation"](e)
        }

        function _glBlendEquationSeparate(e, i) {
            GLctx["blendEquationSeparate"](e, i)
        }

        function _glBlendFuncSeparate(e, i, n, t) {
            GLctx["blendFuncSeparate"](e, i, n, t)
        }

        function _glBlitFramebuffer(e, i, n, t, r, _, o, a, l, u) {
            GLctx["blitFramebuffer"](e, i, n, t, r, _, o, a, l, u)
        }

        function _glBufferData(e, i, n, t) {
            if (n) {
                if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.bufferData(e, HEAPU8, t, n, i), undefined;
                GLctx.bufferData(e, HEAPU8.subarray(n, n + i), t)
            } else GLctx.bufferData(e, i, t)
        }

        function _glBufferSubData(e, i, n, t) {
            return GL.currentContext.supportsWebGL2EntryPoints ? (GLctx.bufferSubData(e, i, HEAPU8, t, n), undefined) : (GLctx.bufferSubData(e, i, HEAPU8.subarray(t, t + n)), undefined)
        }

        function _glCheckFramebufferStatus(e) {
            return GLctx["checkFramebufferStatus"](e)
        }

        function _glClear(e) {
            GLctx["clear"](e)
        }

        function _glClearColor(e, i, n, t) {
            GLctx["clearColor"](e, i, n, t)
        }

        function _glClearDepthf(e) {
            GLctx["clearDepth"](e)
        }

        function _glClearStencil(e) {
            GLctx["clearStencil"](e)
        }

        function _glClientWaitSync(e, i, n, t) {
            n >>>= 0, t >>>= 0;
            var r = 4294967295 == n && 4294967295 == t ? -1 : makeBigInt(n, t, !0);
            return GLctx.clientWaitSync(GL.syncs[e], i, r)
        }

        function _glColorMask(e, i, n, t) {
            GLctx.colorMask(!!e, !!i, !!n, !!t)
        }

        function _glCompileShader(e) {
            GLctx.compileShader(GL.shaders[e])
        }

        function _glCompressedTexImage2D(e, i, n, t, r, _, o, a) {
            return GL.currentContext.supportsWebGL2EntryPoints ? (GLctx["compressedTexImage2D"](e, i, n, t, r, _, HEAPU8, a, o), undefined) : (GLctx["compressedTexImage2D"](e, i, n, t, r, _, a ? HEAPU8.subarray(a, a + o) : null), undefined)
        }

        function _glCompressedTexSubImage2D(e, i, n, t, r, _, o, a, l) {
            return GL.currentContext.supportsWebGL2EntryPoints ? (GLctx["compressedTexSubImage2D"](e, i, n, t, r, _, o, HEAPU8, l, a), undefined) : (GLctx["compressedTexSubImage2D"](e, i, n, t, r, _, o, l ? HEAPU8.subarray(l, l + a) : null), undefined)
        }

        function _glCompressedTexSubImage3D(e, i, n, t, r, _, o, a, l, u, s) {
            GL.currentContext.supportsWebGL2EntryPoints ? GLctx["compressedTexSubImage3D"](e, i, n, t, r, _, o, a, l, HEAPU8, s, u) : GLctx["compressedTexSubImage3D"](e, i, n, t, r, _, o, a, l, s ? HEAPU8.subarray(s, s + u) : null)
        }

        function _glCopyBufferSubData(e, i, n, t, r) {
            GLctx["copyBufferSubData"](e, i, n, t, r)
        }

        function _glCopyTexImage2D(e, i, n, t, r, _, o, a) {
            GLctx["copyTexImage2D"](e, i, n, t, r, _, o, a)
        }

        function _glCopyTexSubImage2D(e, i, n, t, r, _, o, a) {
            GLctx["copyTexSubImage2D"](e, i, n, t, r, _, o, a)
        }

        function _glCreateProgram() {
            var e = GL.getNewId(GL.programs),
                i = GLctx.createProgram();
            return i.name = e, GL.programs[e] = i, e
        }

        function _glCreateShader(e) {
            var i = GL.getNewId(GL.shaders);
            return GL.shaders[i] = GLctx.createShader(e), i
        }

        function _glCullFace(e) {
            GLctx["cullFace"](e)
        }

        function _glDeleteBuffers(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) t = HEAP32[i + 4 * n >> 2], r = GL.buffers[t], r && (GLctx.deleteBuffer(r), r.name = 0, GL.buffers[t] = null, t == GL.currArrayBuffer && (GL.currArrayBuffer = 0), t == GL.currElementArrayBuffer && (GL.currElementArrayBuffer = 0))
        }

        function _glDeleteFramebuffers(e, i) {
            var n, t, r;
            for (n = 0; e > n; ++n) t = HEAP32[i + 4 * n >> 2], r = GL.framebuffers[t], r && (GLctx.deleteFramebuffer(r), r.name = 0, GL.framebuffers[t] = null)
        }

        function _glDeleteProgram(e) {
            if (e) {
                var i = GL.programs[e];
                if (!i) return GL.recordError(1281), undefined;
                GLctx.deleteProgram(i), i.name = 0, GL.programs[e] = null, GL.programInfos[e] = null
            }
        }

        function _glDeleteQueries(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) t = HEAP32[i + 4 * n >> 2], r = GL.queries[t], r && (GLctx["deleteQuery"](r), GL.queries[t] = null)
        }

        function _glDeleteRenderbuffers(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) t = HEAP32[i + 4 * n >> 2], r = GL.renderbuffers[t], r && (GLctx.deleteRenderbuffer(r), r.name = 0, GL.renderbuffers[t] = null)
        }

        function _glDeleteSamplers(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) t = HEAP32[i + 4 * n >> 2], r = GL.samplers[t], r && (GLctx["deleteSampler"](r), r.name = 0, GL.samplers[t] = null)
        }

        function _glDeleteShader(e) {
            if (e) {
                var i = GL.shaders[e];
                if (!i) return GL.recordError(1281), undefined;
                GLctx.deleteShader(i), GL.shaders[e] = null
            }
        }

        function _glDeleteSync(e) {
            if (e) {
                var i = GL.syncs[e];
                if (!i) return GL.recordError(1281), undefined;
                GLctx.deleteSync(i), i.name = 0, GL.syncs[e] = null
            }
        }

        function _glDeleteTextures(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) t = HEAP32[i + 4 * n >> 2], r = GL.textures[t], r && (GLctx.deleteTexture(r), r.name = 0, GL.textures[t] = null)
        }

        function _glDeleteTransformFeedbacks(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) t = HEAP32[i + 4 * n >> 2], r = GL.transformFeedbacks[t], r && (GLctx["deleteTransformFeedback"](r), r.name = 0, GL.transformFeedbacks[t] = null)
        }

        function _glDeleteVertexArrays(e, i) {
            var n, t;
            for (n = 0; e > n; n++) t = HEAP32[i + 4 * n >> 2], GLctx["deleteVertexArray"](GL.vaos[t]), GL.vaos[t] = null
        }

        function _glDepthFunc(e) {
            GLctx["depthFunc"](e)
        }

        function _glDepthMask(e) {
            GLctx.depthMask(!!e)
        }

        function _glDetachShader(e, i) {
            GLctx.detachShader(GL.programs[e], GL.shaders[i])
        }

        function _glDisable(e) {
            GLctx["disable"](e)
        }

        function _glDisableVertexAttribArray(e) {
            GLctx.disableVertexAttribArray(e)
        }

        function _glDrawArrays(e, i, n) {
            GLctx.drawArrays(e, i, n)
        }

        function _glDrawArraysInstanced(e, i, n, t) {
            GLctx["drawArraysInstanced"](e, i, n, t)
        }

        function _glDrawBuffers(e, i) {
            var n, t = GL.tempFixedLengthArray[e];
            for (n = 0; e > n; n++) t[n] = HEAP32[i + 4 * n >> 2];
            GLctx["drawBuffers"](t)
        }

        function _glDrawElements(e, i, n, t) {
            GLctx.drawElements(e, i, n, t)
        }

        function _glDrawElementsInstanced(e, i, n, t, r) {
            GLctx["drawElementsInstanced"](e, i, n, t, r)
        }

        function _glEnable(e) {
            GLctx["enable"](e)
        }

        function _glEnableVertexAttribArray(e) {
            GLctx.enableVertexAttribArray(e)
        }

        function _glEndQuery(e) {
            GLctx["endQuery"](e)
        }

        function _glEndTransformFeedback() {
            GLctx["endTransformFeedback"]()
        }

        function _glFenceSync(e, i) {
            var n, t = GLctx.fenceSync(e, i);
            return t ? (n = GL.getNewId(GL.syncs), t.name = n, GL.syncs[n] = t, n) : 0
        }

        function _glFinish() {
            GLctx["finish"]()
        }

        function _glFlush() {
            GLctx["flush"]()
        }

        function emscriptenWebGLGetBufferBinding(e) {
            switch (e) {
                case 34962:
                    e = 34964;
                    break;
                case 34963:
                    e = 34965;
                    break;
                case 35051:
                    e = 35053;
                    break;
                case 35052:
                    e = 35055;
                    break;
                case 35982:
                    e = 35983;
                    break;
                case 36662:
                    e = 36662;
                    break;
                case 36663:
                    e = 36663;
                    break;
                case 35345:
                    e = 35368
            }
            var i = GLctx.getParameter(e);
            return i ? 0 | i.name : 0
        }

        function emscriptenWebGLValidateMapBufferTarget(e) {
            switch (e) {
                case 34962:
                case 34963:
                case 36662:
                case 36663:
                case 35051:
                case 35052:
                case 35882:
                case 35982:
                case 35345:
                    return !0;
                default:
                    return !1
            }
        }

        function _glFlushMappedBufferRange(e, i, n) {
            if (!emscriptenWebGLValidateMapBufferTarget(e)) return GL.recordError(1280), err("GL_INVALID_ENUM in glFlushMappedBufferRange"), undefined;
            var t = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(e)];
            return t ? 16 & t.access ? 0 > i || 0 > n || i + n > t.length ? (GL.recordError(1281), Module.printError("invalid range in glFlushMappedBufferRange"), undefined) : (GLctx.bufferSubData(e, t.offset, HEAPU8.subarray(t.mem + i, t.mem + i + n)), undefined) : (GL.recordError(1282), Module.printError("buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange"), undefined) : (GL.recordError(1282), Module.printError("buffer was never mapped in glFlushMappedBufferRange"), undefined)
        }

        function _glFramebufferRenderbuffer(e, i, n, t) {
            GLctx.framebufferRenderbuffer(e, i, n, GL.renderbuffers[t])
        }

        function _glFramebufferTexture2D(e, i, n, t, r) {
            GLctx.framebufferTexture2D(e, i, n, GL.textures[t], r)
        }

        function _glFramebufferTextureLayer(e, i, n, t, r) {
            GLctx.framebufferTextureLayer(e, i, GL.textures[n], t, r)
        }

        function _glFrontFace(e) {
            GLctx["frontFace"](e)
        }

        function _glGenBuffers(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) {
                if (t = GLctx.createBuffer(), !t) {
                    GL.recordError(1282);
                    while (e > n) HEAP32[i + 4 * n++ >> 2] = 0;
                    return
                }
                r = GL.getNewId(GL.buffers), t.name = r, GL.buffers[r] = t, HEAP32[i + 4 * n >> 2] = r
            }
        }

        function _glGenFramebuffers(e, i) {
            var n, t, r;
            for (n = 0; e > n; ++n) {
                if (t = GLctx.createFramebuffer(), !t) {
                    GL.recordError(1282);
                    while (e > n) HEAP32[i + 4 * n++ >> 2] = 0;
                    return
                }
                r = GL.getNewId(GL.framebuffers), t.name = r, GL.framebuffers[r] = t, HEAP32[i + 4 * n >> 2] = r
            }
        }

        function _glGenQueries(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) {
                if (t = GLctx["createQuery"](), !t) {
                    GL.recordError(1282);
                    while (e > n) HEAP32[i + 4 * n++ >> 2] = 0;
                    return
                }
                r = GL.getNewId(GL.queries), t.name = r, GL.queries[r] = t, HEAP32[i + 4 * n >> 2] = r
            }
        }

        function _glGenRenderbuffers(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) {
                if (t = GLctx.createRenderbuffer(), !t) {
                    GL.recordError(1282);
                    while (e > n) HEAP32[i + 4 * n++ >> 2] = 0;
                    return
                }
                r = GL.getNewId(GL.renderbuffers), t.name = r, GL.renderbuffers[r] = t, HEAP32[i + 4 * n >> 2] = r
            }
        }

        function _glGenSamplers(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) {
                if (t = GLctx["createSampler"](), !t) {
                    GL.recordError(1282);
                    while (e > n) HEAP32[i + 4 * n++ >> 2] = 0;
                    return
                }
                r = GL.getNewId(GL.samplers), t.name = r, GL.samplers[r] = t, HEAP32[i + 4 * n >> 2] = r
            }
        }

        function _glGenTextures(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) {
                if (t = GLctx.createTexture(), !t) {
                    GL.recordError(1282);
                    while (e > n) HEAP32[i + 4 * n++ >> 2] = 0;
                    return
                }
                r = GL.getNewId(GL.textures), t.name = r, GL.textures[r] = t, HEAP32[i + 4 * n >> 2] = r
            }
        }

        function _glGenTransformFeedbacks(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) {
                if (t = GLctx["createTransformFeedback"](), !t) {
                    GL.recordError(1282);
                    while (e > n) HEAP32[i + 4 * n++ >> 2] = 0;
                    return
                }
                r = GL.getNewId(GL.transformFeedbacks), t.name = r, GL.transformFeedbacks[r] = t, HEAP32[i + 4 * n >> 2] = r
            }
        }

        function _glGenVertexArrays(e, i) {
            var n, t, r;
            for (n = 0; e > n; n++) {
                if (t = GLctx["createVertexArray"](), !t) {
                    GL.recordError(1282);
                    while (e > n) HEAP32[i + 4 * n++ >> 2] = 0;
                    return
                }
                r = GL.getNewId(GL.vaos), t.name = r, GL.vaos[r] = t, HEAP32[i + 4 * n >> 2] = r
            }
        }

        function _glGenerateMipmap(e) {
            GLctx["generateMipmap"](e)
        }

        function _glGetActiveAttrib(e, i, n, t, r, _, o) {
            var a, l;
            e = GL.programs[e], a = GLctx.getActiveAttrib(e, i), a && (n > 0 && o ? (l = stringToUTF8(a.name, o, n), t && (HEAP32[t >> 2] = l)) : t && (HEAP32[t >> 2] = 0), r && (HEAP32[r >> 2] = a.size), _ && (HEAP32[_ >> 2] = a.type))
        }

        function _glGetActiveUniform(e, i, n, t, r, _, o) {
            var a, l;
            e = GL.programs[e], a = GLctx.getActiveUniform(e, i), a && (n > 0 && o ? (l = stringToUTF8(a.name, o, n), t && (HEAP32[t >> 2] = l)) : t && (HEAP32[t >> 2] = 0), r && (HEAP32[r >> 2] = a.size), _ && (HEAP32[_ >> 2] = a.type))
        }

        function _glGetActiveUniformBlockName(e, i, n, t, r) {
            var _, o;
            e = GL.programs[e], _ = GLctx["getActiveUniformBlockName"](e, i), _ && (r && n > 0 ? (o = stringToUTF8(_, r, n), t && (HEAP32[t >> 2] = o)) : t && (HEAP32[t >> 2] = 0))
        }

        function _glGetActiveUniformBlockiv(e, i, n, t) {
            var r, _, o;
            if (!t) return GL.recordError(1281), undefined;
            switch (e = GL.programs[e], n) {
                case 35393:
                    return r = GLctx["getActiveUniformBlockName"](e, i), HEAP32[t >> 2] = r.length + 1, undefined;
                default:
                    if (_ = GLctx["getActiveUniformBlockParameter"](e, i, n), !_) return;
                    if ("number" == typeof _) HEAP32[t >> 2] = _;
                    else
                        for (o = 0; o < _.length; o++) HEAP32[t + 4 * o >> 2] = _[o]
            }
        }

        function _glGetActiveUniformsiv(e, i, n, t, r) {
            var _, o, a, l;
            if (!r) return GL.recordError(1281), undefined;
            if (i > 0 && 0 == n) return GL.recordError(1281), undefined;
            for (e = GL.programs[e], _ = [], o = 0; i > o; o++) _.push(HEAP32[n + 4 * o >> 2]);
            if (a = GLctx["getActiveUniforms"](e, _, t), a)
                for (l = a.length, o = 0; l > o; o++) HEAP32[r + 4 * o >> 2] = a[o]
        }

        function _glGetAttribLocation(e, i) {
            return GLctx.getAttribLocation(GL.programs[e], Pointer_stringify(i))
        }

        function _glGetError() {
            if (GL.lastError) {
                var e = GL.lastError;
                return GL.lastError = 0, e
            }
            return GLctx.getError()
        }

        function _glGetFramebufferAttachmentParameteriv(e, i, n, t) {
            var r = GLctx.getFramebufferAttachmentParameter(e, i, n);
            (r instanceof WebGLRenderbuffer || r instanceof WebGLTexture) && (r = 0 | r.name), HEAP32[t >> 2] = r
        }

        function emscriptenWebGLGetIndexed(e, i, n, t) {
            var r, _;
            if (!n) return GL.recordError(1281), undefined;
            switch (r = GLctx["getIndexedParameter"](e, i), typeof r) {
                case "boolean":
                    _ = r ? 1 : 0;
                    break;
                case "number":
                    _ = r;
                    break;
                case "object":
                    if (null === r) switch (e) {
                        case 35983:
                        case 35368:
                            _ = 0;
                            break;
                        default:
                            return GL.recordError(1280), undefined
                    } else {
                        if (!(r instanceof WebGLBuffer)) return GL.recordError(1280), undefined;
                        _ = 0 | r.name
                    }
                    break;
                default:
                    return GL.recordError(1280), undefined
            }
            switch (t) {
                case "Integer64":
                    tempI64 = [_ >>> 0, (tempDouble = _, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[n >> 2] = tempI64[0], HEAP32[n + 4 >> 2] = tempI64[1];
                    break;
                case "Integer":
                    HEAP32[n >> 2] = _;
                    break;
                case "Float":
                    HEAPF32[n >> 2] = _;
                    break;
                case "Boolean":
                    HEAP8[n >> 0] = _ ? 1 : 0;
                    break;
                default:
                    throw "internal emscriptenWebGLGetIndexed() error, bad type: " + t
            }
        }

        function _glGetIntegeri_v(e, i, n) {
            emscriptenWebGLGetIndexed(e, i, n, "Integer")
        }

        function emscriptenWebGLGet(e, i, n) {
            var t, r, _, o, a;
            if (!i) return GL.recordError(1281), undefined;
            switch (t = undefined, e) {
                case 36346:
                    t = 1;
                    break;
                case 36344:
                    return "Integer" !== n && "Integer64" !== n && GL.recordError(1280), undefined;
                case 34814:
                case 36345:
                    t = 0;
                    break;
                case 34466:
                    r = GLctx.getParameter(34467), t = r.length;
                    break;
                case 33309:
                    if (GLctx.canvas.GLctxObject.version < 2) return GL.recordError(1282), undefined;
                    _ = GLctx.getSupportedExtensions(), t = 2 * _.length;
                    break;
                case 33307:
                case 33308:
                    if (GLctx.canvas.GLctxObject.version < 2) return GL.recordError(1280), undefined;
                    t = 33307 == e ? 3 : 0
            }
            if (undefined === t) switch (o = GLctx.getParameter(e), typeof o) {
                case "number":
                    t = o;
                    break;
                case "boolean":
                    t = o ? 1 : 0;
                    break;
                case "string":
                    return GL.recordError(1280), undefined;
                case "object":
                    if (null === o) switch (e) {
                        case 34964:
                        case 35725:
                        case 34965:
                        case 36006:
                        case 36007:
                        case 32873:
                        case 34229:
                        case 35097:
                        case 36389:
                        case 34068:
                            t = 0;
                            break;
                        default:
                            return GL.recordError(1280), undefined
                    } else {
                        if (o instanceof Float32Array || o instanceof Uint32Array || o instanceof Int32Array || o instanceof Array) {
                            for (a = 0; a < o.length; ++a) switch (n) {
                                case "Integer":
                                    HEAP32[i + 4 * a >> 2] = o[a];
                                    break;
                                case "Float":
                                    HEAPF32[i + 4 * a >> 2] = o[a];
                                    break;
                                case "Boolean":
                                    HEAP8[i + a >> 0] = o[a] ? 1 : 0;
                                    break;
                                default:
                                    throw "internal glGet error, bad type: " + n
                            }
                            return
                        }
                        if (!(o instanceof WebGLBuffer || o instanceof WebGLProgram || o instanceof WebGLFramebuffer || o instanceof WebGLRenderbuffer || o instanceof WebGLQuery || o instanceof WebGLSampler || o instanceof WebGLSync || o instanceof WebGLTransformFeedback || o instanceof WebGLVertexArrayObject || o instanceof WebGLTexture)) return GL.recordError(1280), undefined;
                        t = 0 | o.name
                    }
                    break;
                default:
                    return GL.recordError(1280), undefined
            }
            switch (n) {
                case "Integer64":
                    tempI64 = [t >>> 0, (tempDouble = t, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[i >> 2] = tempI64[0], HEAP32[i + 4 >> 2] = tempI64[1];
                    break;
                case "Integer":
                    HEAP32[i >> 2] = t;
                    break;
                case "Float":
                    HEAPF32[i >> 2] = t;
                    break;
                case "Boolean":
                    HEAP8[i >> 0] = t ? 1 : 0;
                    break;
                default:
                    throw "internal glGet error, bad type: " + n
            }
        }

        function _glGetIntegerv(e, i) {
            emscriptenWebGLGet(e, i, "Integer")
        }

        function _glGetInternalformativ(e, i, n, t, r) {
            var _, o, a, l;
            if (0 > t) return GL.recordError(1281), undefined;
            if (_ = GLctx["getInternalformatParameter"](e, i, 32937), !_) return GL.recordError(1280), undefined;
            switch (n) {
                case 32937:
                    for (o = Math.min(t, _.length), a = 0; o > a; a++) l = _[a], HEAP32[r + 4 * a >> 2] = l;
                    break;
                case 37760:
                    t > 1 && (l = _.length, HEAP32[r >> 2] = l);
                    break;
                default:
                    GL.recordError(1280)
            }
        }

        function _glGetProgramBinary(e, i, n, t, r) {
            GL.recordError(1282)
        }

        function _glGetProgramInfoLog(e, i, n, t) {
            var r, _ = GLctx.getProgramInfoLog(GL.programs[e]);
            null === _ && (_ = "(unknown error)"), i > 0 && t ? (r = stringToUTF8(_, t, i), n && (HEAP32[n >> 2] = r)) : n && (HEAP32[n >> 2] = 0)
        }

        function _glGetProgramiv(e, i, n) {
            var t, r, _, o, a, l, u;
            if (!n) return GL.recordError(1281), undefined;
            if (e >= GL.counter) return GL.recordError(1281), undefined;
            if (t = GL.programInfos[e], !t) return GL.recordError(1282), undefined;
            if (35716 == i) r = GLctx.getProgramInfoLog(GL.programs[e]), null === r && (r = "(unknown error)"), HEAP32[n >> 2] = r.length + 1;
            else if (35719 == i) HEAP32[n >> 2] = t.maxUniformLength;
            else if (35722 == i) {
                if (t.maxAttributeLength == -1)
                    for (e = GL.programs[e], _ = GLctx.getProgramParameter(e, GLctx.ACTIVE_ATTRIBUTES), t.maxAttributeLength = 0, o = 0; _ > o; ++o) a = GLctx.getActiveAttrib(e, o), t.maxAttributeLength = Math.max(t.maxAttributeLength, a.name.length + 1);
                HEAP32[n >> 2] = t.maxAttributeLength
            } else if (35381 == i) {
                if (t.maxUniformBlockNameLength == -1)
                    for (e = GL.programs[e], l = GLctx.getProgramParameter(e, GLctx.ACTIVE_UNIFORM_BLOCKS), t.maxUniformBlockNameLength = 0, o = 0; l > o; ++o) u = GLctx.getActiveUniformBlockName(e, o), t.maxUniformBlockNameLength = Math.max(t.maxUniformBlockNameLength, u.length + 1);
                HEAP32[n >> 2] = t.maxUniformBlockNameLength
            } else HEAP32[n >> 2] = GLctx.getProgramParameter(GL.programs[e], i)
        }

        function _glGetRenderbufferParameteriv(e, i, n) {
            return n ? (HEAP32[n >> 2] = GLctx.getRenderbufferParameter(e, i), undefined) : (GL.recordError(1281), undefined)
        }

        function _glGetShaderInfoLog(e, i, n, t) {
            var r, _ = GLctx.getShaderInfoLog(GL.shaders[e]);
            null === _ && (_ = "(unknown error)"), i > 0 && t ? (r = stringToUTF8(_, t, i), n && (HEAP32[n >> 2] = r)) : n && (HEAP32[n >> 2] = 0)
        }

        function _glGetShaderPrecisionFormat(e, i, n, t) {
            var r = GLctx.getShaderPrecisionFormat(e, i);
            HEAP32[n >> 2] = r.rangeMin, HEAP32[n + 4 >> 2] = r.rangeMax, HEAP32[t >> 2] = r.precision
        }

        function _glGetShaderSource(e, i, n, t) {
            var r, _ = GLctx.getShaderSource(GL.shaders[e]);
            _ && (i > 0 && t ? (r = stringToUTF8(_, t, i), n && (HEAP32[n >> 2] = r)) : n && (HEAP32[n >> 2] = 0))
        }

        function _glGetShaderiv(e, i, n) {
            var t, r, _;
            return n ? (35716 == i ? (t = GLctx.getShaderInfoLog(GL.shaders[e]), null === t && (t = "(unknown error)"), HEAP32[n >> 2] = t.length + 1) : 35720 == i ? (r = GLctx.getShaderSource(GL.shaders[e]), _ = null === r || 0 == r.length ? 0 : r.length + 1, HEAP32[n >> 2] = _) : HEAP32[n >> 2] = GLctx.getShaderParameter(GL.shaders[e], i), undefined) : (GL.recordError(1281), undefined)
        }

        function _glGetString(e) {
            var i, n, t, r, _, o, a, l;
            if (GL.stringCache[e]) return GL.stringCache[e];
            switch (e) {
                case 7936:
                case 7937:
                case 37445:
                case 37446:
                    i = allocate(intArrayFromString(GLctx.getParameter(e)), "i8", ALLOC_NORMAL);
                    break;
                case 7938:
                    n = GLctx.getParameter(GLctx.VERSION), n = GLctx.canvas.GLctxObject.version >= 2 ? "OpenGL ES 3.0 (" + n + ")" : "OpenGL ES 2.0 (" + n + ")", i = allocate(intArrayFromString(n), "i8", ALLOC_NORMAL);
                    break;
                case 7939:
                    for (t = GLctx.getSupportedExtensions(), r = [], _ = 0; _ < t.length; ++_) r.push(t[_]), r.push("GL_" + t[_]);
                    i = allocate(intArrayFromString(r.join(" ")), "i8", ALLOC_NORMAL);
                    break;
                case 35724:
                    o = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION), a = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/, l = o.match(a), null !== l && (3 == l[1].length && (l[1] = l[1] + "0"), o = "OpenGL ES GLSL ES " + l[1] + " (" + o + ")"), i = allocate(intArrayFromString(o), "i8", ALLOC_NORMAL);
                    break;
                default:
                    return GL.recordError(1280), 0
            }
            return GL.stringCache[e] = i, i
        }

        function _glGetStringi(e, i) {
            var n, t, r, _;
            if (GLctx.canvas.GLctxObject.version < 2) return GL.recordError(1282), 0;
            if (n = GL.stringiCache[e], n) return 0 > i || i >= n.length ? (GL.recordError(1281), 0) : n[i];
            switch (e) {
                case 7939:
                    for (t = GLctx.getSupportedExtensions(), r = [], _ = 0; _ < t.length; ++_) r.push(allocate(intArrayFromString(t[_]), "i8", ALLOC_NORMAL)), r.push(allocate(intArrayFromString("GL_" + t[_]), "i8", ALLOC_NORMAL));
                    return n = GL.stringiCache[e] = r, 0 > i || i >= n.length ? (GL.recordError(1281), 0) : n[i];
                default:
                    return GL.recordError(1280), 0
            }
        }

        function _glGetTexParameteriv(e, i, n) {
            return n ? (HEAP32[n >> 2] = GLctx.getTexParameter(e, i), undefined) : (GL.recordError(1281), undefined)
        }

        function _glGetUniformBlockIndex(e, i) {
            return e = GL.programs[e], i = Pointer_stringify(i), GLctx["getUniformBlockIndex"](e, i)
        }

        function _glGetUniformIndices(e, i, n, t) {
            var r, _, o, a;
            if (!t) return GL.recordError(1281), undefined;
            if (i > 0 && (0 == n || 0 == t)) return GL.recordError(1281), undefined;
            for (e = GL.programs[e], r = [], _ = 0; i > _; _++) r.push(Pointer_stringify(HEAP32[n + 4 * _ >> 2]));
            if (o = GLctx["getUniformIndices"](e, r), o)
                for (a = o.length, _ = 0; a > _; _++) HEAP32[t + 4 * _ >> 2] = o[_]
        }

        function _glGetUniformLocation(e, i) {
            var n, t, r, _, o, a;
            if (i = Pointer_stringify(i), n = 0, i.indexOf("]", i.length - 1) !== -1) {
                if (t = i.lastIndexOf("["), r = i.slice(t + 1, -1), r.length > 0 && (n = parseInt(r), 0 > n)) return -1;
                i = i.slice(0, t)
            }
            return _ = GL.programInfos[e], _ ? (o = _.uniforms, a = o[i], a && n < a[0] ? a[1] + n : -1) : -1
        }

        function emscriptenWebGLGetUniform(e, i, n, t) {
            var r, _;
            if (!n) return GL.recordError(1281), undefined;
            if (r = GLctx.getUniform(GL.programs[e], GL.uniforms[i]), "number" == typeof r || "boolean" == typeof r) switch (t) {
                case "Integer":
                    HEAP32[n >> 2] = r;
                    break;
                case "Float":
                    HEAPF32[n >> 2] = r;
                    break;
                default:
                    throw "internal emscriptenWebGLGetUniform() error, bad type: " + t
            } else
                for (_ = 0; _ < r.length; _++) switch (t) {
                    case "Integer":
                        HEAP32[n + 4 * _ >> 2] = r[_];
                        break;
                    case "Float":
                        HEAPF32[n + 4 * _ >> 2] = r[_];
                        break;
                    default:
                        throw "internal emscriptenWebGLGetUniform() error, bad type: " + t
                }
        }

        function _glGetUniformiv(e, i, n) {
            emscriptenWebGLGetUniform(e, i, n, "Integer")
        }

        function emscriptenWebGLGetVertexAttrib(e, i, n, t) {
            var r, _;
            if (!n) return GL.recordError(1281), undefined;
            if (r = GLctx.getVertexAttrib(e, i), 34975 == i) HEAP32[n >> 2] = r["name"];
            else if ("number" == typeof r || "boolean" == typeof r) switch (t) {
                case "Integer":
                    HEAP32[n >> 2] = r;
                    break;
                case "Float":
                    HEAPF32[n >> 2] = r;
                    break;
                case "FloatToInteger":
                    HEAP32[n >> 2] = Math.fround(r);
                    break;
                default:
                    throw "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + t
            } else
                for (_ = 0; _ < r.length; _++) switch (t) {
                    case "Integer":
                        HEAP32[n + 4 * _ >> 2] = r[_];
                        break;
                    case "Float":
                        HEAPF32[n + 4 * _ >> 2] = r[_];
                        break;
                    case "FloatToInteger":
                        HEAP32[n + 4 * _ >> 2] = Math.fround(r[_]);
                        break;
                    default:
                        throw "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + t
                }
        }

        function _glGetVertexAttribiv(e, i, n) {
            emscriptenWebGLGetVertexAttrib(e, i, n, "FloatToInteger")
        }

        function _glInvalidateFramebuffer(e, i, n) {
            var t, r = GL.tempFixedLengthArray[i];
            for (t = 0; i > t; t++) r[t] = HEAP32[n + 4 * t >> 2];
            GLctx["invalidateFramebuffer"](e, r)
        }

        function _glIsEnabled(e) {
            return GLctx["isEnabled"](e)
        }

        function _glIsVertexArray(e) {
            var i = GL.vaos[e];
            return i ? GLctx["isVertexArray"](i) : 0
        }

        function _glLinkProgram(e) {
            GLctx.linkProgram(GL.programs[e]), GL.programInfos[e] = null, GL.populateUniformTable(e)
        }

        function _glMapBufferRange(e, i, n, t) {
            if (26 != t && 10 != t) return err("glMapBufferRange is only supported when access is MAP_WRITE|INVALIDATE_BUFFER"), 0;
            if (!emscriptenWebGLValidateMapBufferTarget(e)) return GL.recordError(1280), err("GL_INVALID_ENUM in glMapBufferRange"), 0;
            var r = _malloc(n);
            return r ? (GL.mappedBuffers[emscriptenWebGLGetBufferBinding(e)] = {
                offset: i,
                length: n,
                mem: r,
                access: t
            }, r) : 0
        }

        function _glPixelStorei(e, i) {
            3333 == e ? GL.packAlignment = i : 3317 == e && (GL.unpackAlignment = i), GLctx.pixelStorei(e, i)
        }

        function _glPolygonOffset(e, i) {
            GLctx["polygonOffset"](e, i)
        }

        function _glProgramBinary(e, i, n, t) {
            GL.recordError(1280)
        }

        function _glProgramParameteri(e, i, n) {
            GL.recordError(1280)
        }

        function _glReadBuffer(e) {
            GLctx["readBuffer"](e)
        }

        function emscriptenWebGLComputeImageSize(e, i, n, t) {
            function r(e, i) {
                return Math.floor((e + i - 1) / i) * i
            }
            var _ = e * n,
                o = r(_, t);
            return 0 >= i ? 0 : (i - 1) * o + _
        }

        function emscriptenWebGLGetTexPixelData(e, i, n, t, r, _) {
            var o, a, l;
            switch (i) {
                case 6406:
                case 6409:
                case 6402:
                case 6403:
                case 36244:
                    a = 1;
                    break;
                case 6410:
                case 33319:
                case 33320:
                    a = 2;
                    break;
                case 6407:
                case 35904:
                case 36248:
                    a = 3;
                    break;
                case 6408:
                case 35906:
                case 36249:
                    a = 4;
                    break;
                default:
                    return GL.recordError(1280), null
            }
            switch (e) {
                case 5121:
                case 5120:
                    o = 1 * a;
                    break;
                case 5123:
                case 36193:
                case 5131:
                case 5122:
                    o = 2 * a;
                    break;
                case 5125:
                case 5126:
                case 5124:
                    o = 4 * a;
                    break;
                case 34042:
                case 35902:
                case 33640:
                case 35899:
                case 34042:
                    o = 4;
                    break;
                case 33635:
                case 32819:
                case 32820:
                    o = 2;
                    break;
                default:
                    return GL.recordError(1280), null
            }
            switch (l = emscriptenWebGLComputeImageSize(n, t, o, GL.unpackAlignment), e) {
                case 5120:
                    return HEAP8.subarray(r, r + l);
                case 5121:
                    return HEAPU8.subarray(r, r + l);
                case 5122:
                    return HEAP16.subarray(r >> 1, r + l >> 1);
                case 5124:
                    return HEAP32.subarray(r >> 2, r + l >> 2);
                case 5126:
                    return HEAPF32.subarray(r >> 2, r + l >> 2);
                case 5125:
                case 34042:
                case 35902:
                case 33640:
                case 35899:
                case 34042:
                    return HEAPU32.subarray(r >> 2, r + l >> 2);
                case 5123:
                case 33635:
                case 32819:
                case 32820:
                case 36193:
                case 5131:
                    return HEAPU16.subarray(r >> 1, r + l >> 1);
                default:
                    return GL.recordError(1280), null
            }
        }

        function emscriptenWebGLGetHeapForType(e) {
            switch (e) {
                case 5120:
                    return HEAP8;
                case 5121:
                    return HEAPU8;
                case 5122:
                    return HEAP16;
                case 5123:
                case 33635:
                case 32819:
                case 32820:
                case 36193:
                case 5131:
                    return HEAPU16;
                case 5124:
                    return HEAP32;
                case 5125:
                case 34042:
                case 35902:
                case 33640:
                case 35899:
                case 34042:
                    return HEAPU32;
                case 5126:
                    return HEAPF32;
                default:
                    return null
            }
        }

        function emscriptenWebGLGetShiftForType(e) {
            switch (e) {
                case 5120:
                case 5121:
                    return 0;
                case 5122:
                case 5123:
                case 33635:
                case 32819:
                case 32820:
                case 36193:
                case 5131:
                    return 1;
                case 5124:
                case 5126:
                case 5125:
                case 34042:
                case 35902:
                case 33640:
                case 35899:
                case 34042:
                    return 2;
                default:
                    return 0
            }
        }

        function _glReadPixels(e, i, n, t, r, _, o) {
            if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.currentPixelPackBufferBinding ? GLctx.readPixels(e, i, n, t, r, _, o) : GLctx.readPixels(e, i, n, t, r, _, emscriptenWebGLGetHeapForType(_), o >> emscriptenWebGLGetShiftForType(_)), undefined;
            var a = emscriptenWebGLGetTexPixelData(_, r, n, t, o, r);
            return a ? (GLctx.readPixels(e, i, n, t, r, _, a), undefined) : (GL.recordError(1280), undefined)
        }

        function _glRenderbufferStorage(e, i, n, t) {
            GLctx["renderbufferStorage"](e, i, n, t)
        }

        function _glRenderbufferStorageMultisample(e, i, n, t, r) {
            GLctx["renderbufferStorageMultisample"](e, i, n, t, r)
        }

        function _glSamplerParameteri(e, i, n) {
            GLctx["samplerParameteri"](e ? GL.samplers[e] : null, i, n)
        }

        function _glScissor(e, i, n, t) {
            GLctx["scissor"](e, i, n, t)
        }

        function _glShaderSource(e, i, n, t) {
            var r = GL.getSource(e, i, n, t);
            GLctx.shaderSource(GL.shaders[e], r)
        }

        function _glStencilFuncSeparate(e, i, n, t) {
            GLctx["stencilFuncSeparate"](e, i, n, t)
        }

        function _glStencilMask(e) {
            GLctx["stencilMask"](e)
        }

        function _glStencilOpSeparate(e, i, n, t) {
            GLctx["stencilOpSeparate"](e, i, n, t)
        }

        function _glTexImage2D(e, i, n, t, r, _, o, a, l) {
            if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.currentPixelUnpackBufferBinding ? GLctx.texImage2D(e, i, n, t, r, _, o, a, l) : 0 != l ? GLctx.texImage2D(e, i, n, t, r, _, o, a, emscriptenWebGLGetHeapForType(a), l >> emscriptenWebGLGetShiftForType(a)) : GLctx.texImage2D(e, i, n, t, r, _, o, a, null), undefined;
            var u = null;
            l && (u = emscriptenWebGLGetTexPixelData(a, o, t, r, l, n)), GLctx.texImage2D(e, i, n, t, r, _, o, a, u)
        }

        function _glTexImage3D(e, i, n, t, r, _, o, a, l, u) {
            GLctx.currentPixelUnpackBufferBinding ? GLctx["texImage3D"](e, i, n, t, r, _, o, a, l, u) : 0 != u ? GLctx["texImage3D"](e, i, n, t, r, _, o, a, l, emscriptenWebGLGetHeapForType(l), u >> emscriptenWebGLGetShiftForType(l)) : GLctx["texImage3D"](e, i, n, t, r, _, o, a, l, null)
        }

        function _glTexParameterf(e, i, n) {
            GLctx["texParameterf"](e, i, n)
        }

        function _glTexParameteri(e, i, n) {
            GLctx["texParameteri"](e, i, n)
        }

        function _glTexParameteriv(e, i, n) {
            var t = HEAP32[n >> 2];
            GLctx.texParameteri(e, i, t)
        }

        function _glTexStorage2D(e, i, n, t, r) {
            GLctx["texStorage2D"](e, i, n, t, r)
        }

        function _glTexStorage3D(e, i, n, t, r, _) {
            GLctx["texStorage3D"](e, i, n, t, r, _)
        }

        function _glTexSubImage2D(e, i, n, t, r, _, o, a, l) {
            if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.currentPixelUnpackBufferBinding ? GLctx.texSubImage2D(e, i, n, t, r, _, o, a, l) : 0 != l ? GLctx.texSubImage2D(e, i, n, t, r, _, o, a, emscriptenWebGLGetHeapForType(a), l >> emscriptenWebGLGetShiftForType(a)) : GLctx.texSubImage2D(e, i, n, t, r, _, o, a, null), undefined;
            var u = null;
            l && (u = emscriptenWebGLGetTexPixelData(a, o, r, _, l, 0)), GLctx.texSubImage2D(e, i, n, t, r, _, o, a, u)
        }

        function _glTexSubImage3D(e, i, n, t, r, _, o, a, l, u, s) {
            GLctx.currentPixelUnpackBufferBinding ? GLctx["texSubImage3D"](e, i, n, t, r, _, o, a, l, u, s) : 0 != s ? GLctx["texSubImage3D"](e, i, n, t, r, _, o, a, l, u, emscriptenWebGLGetHeapForType(u), s >> emscriptenWebGLGetShiftForType(u)) : GLctx["texSubImage3D"](e, i, n, t, r, _, o, a, l, u, null)
        }

        function _glTransformFeedbackVaryings(e, i, n, t) {
            var r, _;
            for (e = GL.programs[e], r = [], _ = 0; i > _; _++) r.push(Pointer_stringify(HEAP32[n + 4 * _ >> 2]));
            GLctx["transformFeedbackVaryings"](e, r, t)
        }

        function _glUniform1fv(e, i, n) {
            var t, r;
            if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.uniform1fv(GL.uniforms[e], HEAPF32, n >> 2, i), undefined;
            if (i <= GL.MINI_TEMP_BUFFER_SIZE)
                for (t = GL.miniTempBufferViews[i - 1], r = 0; i > r; ++r) t[r] = HEAPF32[n + 4 * r >> 2];
            else t = HEAPF32.subarray(n >> 2, n + 4 * i >> 2);
            GLctx.uniform1fv(GL.uniforms[e], t)
        }

        function _glUniform1i(e, i) {
            GLctx.uniform1i(GL.uniforms[e], i)
        }

        function _glUniform1iv(e, i, n) {
            return GL.currentContext.supportsWebGL2EntryPoints ? (GLctx.uniform1iv(GL.uniforms[e], HEAP32, n >> 2, i), undefined) : (GLctx.uniform1iv(GL.uniforms[e], HEAP32.subarray(n >> 2, n + 4 * i >> 2)), undefined)
        }

        function _glUniform1uiv(e, i, n) {
            GL.currentContext.supportsWebGL2EntryPoints ? GLctx.uniform1uiv(GL.uniforms[e], HEAPU32, n >> 2, i) : GLctx.uniform1uiv(GL.uniforms[e], HEAPU32.subarray(n >> 2, n + 4 * i >> 2))
        }

        function _glUniform2fv(e, i, n) {
            var t, r;
            if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.uniform2fv(GL.uniforms[e], HEAPF32, n >> 2, 2 * i), undefined;
            if (2 * i <= GL.MINI_TEMP_BUFFER_SIZE)
                for (t = GL.miniTempBufferViews[2 * i - 1], r = 0; 2 * i > r; r += 2) t[r] = HEAPF32[n + 4 * r >> 2], t[r + 1] = HEAPF32[n + (4 * r + 4) >> 2];
            else t = HEAPF32.subarray(n >> 2, n + 8 * i >> 2);
            GLctx.uniform2fv(GL.uniforms[e], t)
        }

        function _glUniform2iv(e, i, n) {
            return GL.currentContext.supportsWebGL2EntryPoints ? (GLctx.uniform2iv(GL.uniforms[e], HEAP32, n >> 2, 2 * i), undefined) : (GLctx.uniform2iv(GL.uniforms[e], HEAP32.subarray(n >> 2, n + 8 * i >> 2)), undefined)
        }

        function _glUniform2uiv(e, i, n) {
            GL.currentContext.supportsWebGL2EntryPoints ? GLctx.uniform2uiv(GL.uniforms[e], HEAPU32, n >> 2, 2 * i) : GLctx.uniform2uiv(GL.uniforms[e], HEAPU32.subarray(n >> 2, n + 8 * i >> 2))
        }

        function _glUniform3fv(e, i, n) {
            var t, r;
            if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.uniform3fv(GL.uniforms[e], HEAPF32, n >> 2, 3 * i), undefined;
            if (3 * i <= GL.MINI_TEMP_BUFFER_SIZE)
                for (t = GL.miniTempBufferViews[3 * i - 1], r = 0; 3 * i > r; r += 3) t[r] = HEAPF32[n + 4 * r >> 2], t[r + 1] = HEAPF32[n + (4 * r + 4) >> 2], t[r + 2] = HEAPF32[n + (4 * r + 8) >> 2];
            else t = HEAPF32.subarray(n >> 2, n + 12 * i >> 2);
            GLctx.uniform3fv(GL.uniforms[e], t)
        }

        function _glUniform3iv(e, i, n) {
            return GL.currentContext.supportsWebGL2EntryPoints ? (GLctx.uniform3iv(GL.uniforms[e], HEAP32, n >> 2, 3 * i), undefined) : (GLctx.uniform3iv(GL.uniforms[e], HEAP32.subarray(n >> 2, n + 12 * i >> 2)), undefined)
        }

        function _glUniform3uiv(e, i, n) {
            GL.currentContext.supportsWebGL2EntryPoints ? GLctx.uniform3uiv(GL.uniforms[e], HEAPU32, n >> 2, 3 * i) : GLctx.uniform3uiv(GL.uniforms[e], HEAPU32.subarray(n >> 2, n + 12 * i >> 2))
        }

        function _glUniform4fv(e, i, n) {
            var t, r;
            if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.uniform4fv(GL.uniforms[e], HEAPF32, n >> 2, 4 * i), undefined;
            if (4 * i <= GL.MINI_TEMP_BUFFER_SIZE)
                for (t = GL.miniTempBufferViews[4 * i - 1], r = 0; 4 * i > r; r += 4) t[r] = HEAPF32[n + 4 * r >> 2], t[r + 1] = HEAPF32[n + (4 * r + 4) >> 2], t[r + 2] = HEAPF32[n + (4 * r + 8) >> 2], t[r + 3] = HEAPF32[n + (4 * r + 12) >> 2];
            else t = HEAPF32.subarray(n >> 2, n + 16 * i >> 2);
            GLctx.uniform4fv(GL.uniforms[e], t)
        }

        function _glUniform4iv(e, i, n) {
            return GL.currentContext.supportsWebGL2EntryPoints ? (GLctx.uniform4iv(GL.uniforms[e], HEAP32, n >> 2, 4 * i), undefined) : (GLctx.uniform4iv(GL.uniforms[e], HEAP32.subarray(n >> 2, n + 16 * i >> 2)), undefined)
        }

        function _glUniform4uiv(e, i, n) {
            GL.currentContext.supportsWebGL2EntryPoints ? GLctx.uniform4uiv(GL.uniforms[e], HEAPU32, n >> 2, 4 * i) : GLctx.uniform4uiv(GL.uniforms[e], HEAPU32.subarray(n >> 2, n + 16 * i >> 2))
        }

        function _glUniformBlockBinding(e, i, n) {
            e = GL.programs[e], GLctx["uniformBlockBinding"](e, i, n)
        }

        function _glUniformMatrix3fv(e, i, n, t) {
            var r, _;
            if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.uniformMatrix3fv(GL.uniforms[e], !!n, HEAPF32, t >> 2, 9 * i), undefined;
            if (9 * i <= GL.MINI_TEMP_BUFFER_SIZE)
                for (r = GL.miniTempBufferViews[9 * i - 1], _ = 0; 9 * i > _; _ += 9) r[_] = HEAPF32[t + 4 * _ >> 2], r[_ + 1] = HEAPF32[t + (4 * _ + 4) >> 2], r[_ + 2] = HEAPF32[t + (4 * _ + 8) >> 2], r[_ + 3] = HEAPF32[t + (4 * _ + 12) >> 2], r[_ + 4] = HEAPF32[t + (4 * _ + 16) >> 2], r[_ + 5] = HEAPF32[t + (4 * _ + 20) >> 2], r[_ + 6] = HEAPF32[t + (4 * _ + 24) >> 2], r[_ + 7] = HEAPF32[t + (4 * _ + 28) >> 2], r[_ + 8] = HEAPF32[t + (4 * _ + 32) >> 2];
            else r = HEAPF32.subarray(t >> 2, t + 36 * i >> 2);
            GLctx.uniformMatrix3fv(GL.uniforms[e], !!n, r)
        }

        function _glUniformMatrix4fv(e, i, n, t) {
            var r, _;
            if (GL.currentContext.supportsWebGL2EntryPoints) return GLctx.uniformMatrix4fv(GL.uniforms[e], !!n, HEAPF32, t >> 2, 16 * i), undefined;
            if (16 * i <= GL.MINI_TEMP_BUFFER_SIZE)
                for (r = GL.miniTempBufferViews[16 * i - 1], _ = 0; 16 * i > _; _ += 16) r[_] = HEAPF32[t + 4 * _ >> 2], r[_ + 1] = HEAPF32[t + (4 * _ + 4) >> 2], r[_ + 2] = HEAPF32[t + (4 * _ + 8) >> 2], r[_ + 3] = HEAPF32[t + (4 * _ + 12) >> 2], r[_ + 4] = HEAPF32[t + (4 * _ + 16) >> 2], r[_ + 5] = HEAPF32[t + (4 * _ + 20) >> 2], r[_ + 6] = HEAPF32[t + (4 * _ + 24) >> 2], r[_ + 7] = HEAPF32[t + (4 * _ + 28) >> 2], r[_ + 8] = HEAPF32[t + (4 * _ + 32) >> 2], r[_ + 9] = HEAPF32[t + (4 * _ + 36) >> 2], r[_ + 10] = HEAPF32[t + (4 * _ + 40) >> 2], r[_ + 11] = HEAPF32[t + (4 * _ + 44) >> 2], r[_ + 12] = HEAPF32[t + (4 * _ + 48) >> 2], r[_ + 13] = HEAPF32[t + (4 * _ + 52) >> 2], r[_ + 14] = HEAPF32[t + (4 * _ + 56) >> 2], r[_ + 15] = HEAPF32[t + (4 * _ + 60) >> 2];
            else r = HEAPF32.subarray(t >> 2, t + 64 * i >> 2);
            GLctx.uniformMatrix4fv(GL.uniforms[e], !!n, r)
        }

        function _glUnmapBuffer(e) {
            var i, n;
            return emscriptenWebGLValidateMapBufferTarget(e) ? (i = emscriptenWebGLGetBufferBinding(e), n = GL.mappedBuffers[i], n ? (GL.mappedBuffers[i] = null, 16 & n.access || (GL.currentContext.supportsWebGL2EntryPoints ? GLctx.bufferSubData(e, n.offset, HEAPU8, n.mem, n.length) : GLctx.bufferSubData(e, n.offset, HEAPU8.subarray(n.mem, n.mem + n.length))), _free(n.mem), 1) : (GL.recordError(1282), Module.printError("buffer was never mapped in glUnmapBuffer"), 0)) : (GL.recordError(1280), err("GL_INVALID_ENUM in glUnmapBuffer"), 0)
        }

        function _glUseProgram(e) {
            GLctx.useProgram(e ? GL.programs[e] : null)
        }

        function _glValidateProgram(e) {
            GLctx.validateProgram(GL.programs[e])
        }

        function _glVertexAttrib4f(e, i, n, t, r) {
            GLctx["vertexAttrib4f"](e, i, n, t, r)
        }

        function _glVertexAttrib4fv(e, i) {
            GLctx.vertexAttrib4f(e, HEAPF32[i >> 2], HEAPF32[i + 4 >> 2], HEAPF32[i + 8 >> 2], HEAPF32[i + 12 >> 2])
        }

        function _glVertexAttribIPointer(e, i, n, t, r) {
            var _ = GL.currentContext.clientBuffers[e];
            return GL.currArrayBuffer ? (_.clientside = !1, GLctx.vertexAttribIPointer(e, i, n, t, r), undefined) : (_.size = i, _.type = n, _.normalized = !1, _.stride = t, _.ptr = r, _.clientside = !0, undefined)
        }

        function _glVertexAttribPointer(e, i, n, t, r, _) {
            GLctx.vertexAttribPointer(e, i, n, !!t, r, _)
        }

        function _glViewport(e, i, n, t) {
            GLctx["viewport"](e, i, n, t)
        }

        function _gmtime_r(e, i) {
            var n, t, r = new Date(1e3 * HEAP32[e >> 2]);
            return HEAP32[i >> 2] = r.getUTCSeconds(), HEAP32[i + 4 >> 2] = r.getUTCMinutes(), HEAP32[i + 8 >> 2] = r.getUTCHours(), HEAP32[i + 12 >> 2] = r.getUTCDate(), HEAP32[i + 16 >> 2] = r.getUTCMonth(), HEAP32[i + 20 >> 2] = r.getUTCFullYear() - 1900, HEAP32[i + 24 >> 2] = r.getUTCDay(), HEAP32[i + 36 >> 2] = 0, HEAP32[i + 32 >> 2] = 0, n = Date.UTC(r.getUTCFullYear(), 0, 1, 0, 0, 0, 0), t = (r.getTime() - n) / (1e3 * 60 * 60 * 24) | 0, HEAP32[i + 28 >> 2] = t, HEAP32[i + 40 >> 2] = ___tm_timezone, i
        }

        function _gmtime(e) {
            return _gmtime_r(e, ___tm_current)
        }

        function _inet_addr(e) {
            var i = __inet_pton4_raw(Pointer_stringify(e));
            return null === i ? -1 : i
        }

        function _llvm_copysign_f64(e, i) {
            return 0 > i || 0 === i && 0 > 1 / i ? -Math_abs(e) : Math_abs(e)
        }

        function _llvm_cttz_i32(e) {
            return e = 0 | e, 0 | (e ? 31 - (0 | Math_clz32(e ^ e - 1)) | 0 : 32)
        }

        function _llvm_eh_typeid_for(e) {
            return e
        }

        function _llvm_exp2_f32(e) {
            return Math.pow(2, e)
        }

        function _llvm_log10_f32(e) {
            return Math.log(e) / Math.LN10
        }

        function _llvm_log2_f32(e) {
            return Math.log(e) / Math.LN2
        }

        function _llvm_trap() {
            abort("trap!")
        }

        function _tzset() {
            function e(e) {
                var i = e.toTimeString().match(/\(([A-Za-z ]+)\)$/);
                return i ? i[1] : "GMT"
            }
            var i, n, t, r, _, o;
            _tzset.called || (_tzset.called = !0, HEAP32[__get_timezone() >> 2] = 60 * (new Date).getTimezoneOffset(), i = new Date(2e3, 0, 1), n = new Date(2e3, 6, 1), HEAP32[__get_daylight() >> 2] = Number(i.getTimezoneOffset() != n.getTimezoneOffset()), t = e(i), r = e(n), _ = allocate(intArrayFromString(t), "i8", ALLOC_NORMAL), o = allocate(intArrayFromString(r), "i8", ALLOC_NORMAL), n.getTimezoneOffset() < i.getTimezoneOffset() ? (HEAP32[__get_tzname() >> 2] = _, HEAP32[__get_tzname() + 4 >> 2] = o) : (HEAP32[__get_tzname() >> 2] = o, HEAP32[__get_tzname() + 4 >> 2] = _))
        }

        function _localtime_r(e, i) {
            var n, t, r, _, o, a, l;
            return _tzset(), n = new Date(1e3 * HEAP32[e >> 2]), HEAP32[i >> 2] = n.getSeconds(), HEAP32[i + 4 >> 2] = n.getMinutes(), HEAP32[i + 8 >> 2] = n.getHours(), HEAP32[i + 12 >> 2] = n.getDate(), HEAP32[i + 16 >> 2] = n.getMonth(), HEAP32[i + 20 >> 2] = n.getFullYear() - 1900, HEAP32[i + 24 >> 2] = n.getDay(), t = new Date(n.getFullYear(), 0, 1), r = (n.getTime() - t.getTime()) / (1e3 * 60 * 60 * 24) | 0, HEAP32[i + 28 >> 2] = r, HEAP32[i + 36 >> 2] = -(60 * n.getTimezoneOffset()), _ = new Date(2e3, 6, 1).getTimezoneOffset(), o = t.getTimezoneOffset(), a = 0 | (_ != o && n.getTimezoneOffset() == Math.min(o, _)), HEAP32[i + 32 >> 2] = a, l = HEAP32[__get_tzname() + (a ? 4 : 0) >> 2], HEAP32[i + 40 >> 2] = l, i
        }

        function _localtime(e) {
            return _localtime_r(e, ___tm_current)
        }

        function _emscripten_memcpy_big(e, i, n) {
            return HEAPU8.set(HEAPU8.subarray(i, i + n), e), e
        }

        function _mktime(e) {
            var i, n, t, r, _, o, a, l, u, s;
            return _tzset(), i = new Date(HEAP32[e + 20 >> 2] + 1900, HEAP32[e + 16 >> 2], HEAP32[e + 12 >> 2], HEAP32[e + 8 >> 2], HEAP32[e + 4 >> 2], HEAP32[e >> 2], 0), n = HEAP32[e + 32 >> 2], t = i.getTimezoneOffset(), r = new Date(i.getFullYear(), 0, 1), _ = new Date(2e3, 6, 1).getTimezoneOffset(), o = r.getTimezoneOffset(), a = Math.min(o, _), 0 > n ? HEAP32[e + 32 >> 2] = Number(_ != o && a == t) : n > 0 != (a == t) && (l = Math.max(o, _), u = n > 0 ? a : l, i.setTime(i.getTime() + 6e4 * (u - t))), HEAP32[e + 24 >> 2] = i.getDay(), s = (i.getTime() - r.getTime()) / (1e3 * 60 * 60 * 24) | 0, HEAP32[e + 28 >> 2] = s, i.getTime() / 1e3 | 0
        }

        function _pthread_cond_destroy() {
            return 0
        }

        function _pthread_cond_init() {
            return 0
        }

        function _pthread_cond_timedwait() {
            return 0
        }

        function _pthread_cond_wait() {
            return 0
        }

        function _pthread_getspecific(e) {
            return PTHREAD_SPECIFIC[e] || 0
        }

        function _pthread_key_create(e, i) {
            return 0 == e ? ERRNO_CODES.EINVAL : (HEAP32[e >> 2] = PTHREAD_SPECIFIC_NEXT_KEY, PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY] = 0, PTHREAD_SPECIFIC_NEXT_KEY++, 0)
        }

        function _pthread_key_delete(e) {
            return e in PTHREAD_SPECIFIC ? (delete PTHREAD_SPECIFIC[e], 0) : ERRNO_CODES.EINVAL
        }

        function _pthread_mutex_destroy() {}

        function _pthread_mutex_init() {}

        function _pthread_mutexattr_destroy() {}

        function _pthread_mutexattr_init() {}

        function _pthread_mutexattr_setprotocol() {}

        function _pthread_mutexattr_settype() {}

        function _pthread_once(e, i) {
            _pthread_once.seen || (_pthread_once.seen = {}), e in _pthread_once.seen || (Module["dynCall_v"](i), _pthread_once.seen[e] = 1)
        }

        function _pthread_setspecific(e, i) {
            return e in PTHREAD_SPECIFIC ? (PTHREAD_SPECIFIC[e] = i, 0) : ERRNO_CODES.EINVAL
        }

        function _sched_yield() {
            return 0
        }

        function _setenv(e, i, n) {
            var t, r;
            return 0 === e ? (___setErrNo(ERRNO_CODES.EINVAL), -1) : (t = Pointer_stringify(e), r = Pointer_stringify(i), "" === t || t.indexOf("=") !== -1 ? (___setErrNo(ERRNO_CODES.EINVAL), -1) : ENV.hasOwnProperty(t) && !n ? 0 : (ENV[t] = r, ___buildEnvironment(__get_environ()), 0))
        }

        function _sigaction(e, i, n) {
            return 0
        }

        function _sigemptyset(e) {
            return HEAP32[e >> 2] = 0, 0
        }

        function __isLeapYear(e) {
            return e % 4 === 0 && (e % 100 !== 0 || e % 400 === 0)
        }

        function __arraySum(e, i) {
            var n, t = 0;
            for (n = 0; i >= n; t += e[n++]);
            return t
        }

        function __addDays(e, i) {
            var n, t, r, _ = new Date(e.getTime());
            while (i > 0) {
                if (n = __isLeapYear(_.getFullYear()), t = _.getMonth(), r = (n ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[t], !(i > r - _.getDate())) return _.setDate(_.getDate() + i), _;
                i -= r - _.getDate() + 1, _.setDate(1), 11 > t ? _.setMonth(t + 1) : (_.setMonth(0), _.setFullYear(_.getFullYear() + 1))
            }
            return _
        }

        function _strftime(e, i, n, t) {
            function r(e, i, n) {
                var t = "number" == typeof e ? e.toString() : e || "";
                while (t.length < i) t = n[0] + t;
                return t
            }

            function _(e, i) {
                return r(e, i, "0")
            }

            function o(e, i) {
                function n(e) {
                    return 0 > e ? -1 : e > 0 ? 1 : 0
                }
                var t;
                return 0 === (t = n(e.getFullYear() - i.getFullYear())) && 0 === (t = n(e.getMonth() - i.getMonth())) && (t = n(e.getDate() - i.getDate())), t
            }

            function a(e) {
                switch (e.getDay()) {
                    case 0:
                        return new Date(e.getFullYear() - 1, 11, 29);
                    case 1:
                        return e;
                    case 2:
                        return new Date(e.getFullYear(), 0, 3);
                    case 3:
                        return new Date(e.getFullYear(), 0, 2);
                    case 4:
                        return new Date(e.getFullYear(), 0, 1);
                    case 5:
                        return new Date(e.getFullYear() - 1, 11, 31);
                    case 6:
                        return new Date(e.getFullYear() - 1, 11, 30)
                }
            }

            function l(e) {
                var i = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday),
                    n = new Date(i.getFullYear(), 0, 4),
                    t = new Date(i.getFullYear() + 1, 0, 4),
                    r = a(n),
                    _ = a(t);
                return o(r, i) <= 0 ? o(_, i) <= 0 ? i.getFullYear() + 1 : i.getFullYear() : i.getFullYear() - 1
            }
            var u, s, c, f, d, p = HEAP32[t + 40 >> 2],
                m = {
                    tm_sec: HEAP32[t >> 2],
                    tm_min: HEAP32[t + 4 >> 2],
                    tm_hour: HEAP32[t + 8 >> 2],
                    tm_mday: HEAP32[t + 12 >> 2],
                    tm_mon: HEAP32[t + 16 >> 2],
                    tm_year: HEAP32[t + 20 >> 2],
                    tm_wday: HEAP32[t + 24 >> 2],
                    tm_yday: HEAP32[t + 28 >> 2],
                    tm_isdst: HEAP32[t + 32 >> 2],
                    tm_gmtoff: HEAP32[t + 36 >> 2],
                    tm_zone: p ? Pointer_stringify(p) : ""
                },
                v = Pointer_stringify(n),
                y = {
                    "%c": "%a %b %d %H:%M:%S %Y",
                    "%D": "%m/%d/%y",
                    "%F": "%Y-%m-%d",
                    "%h": "%b",
                    "%r": "%I:%M:%S %p",
                    "%R": "%H:%M",
                    "%T": "%H:%M:%S",
                    "%x": "%m/%d/%y",
                    "%X": "%H:%M:%S"
                };
            for (u in y) v = v.replace(new RegExp(u, "g"), y[u]);
            s = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], c = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], f = {
                "%a": function(e) {
                    return s[e.tm_wday].substring(0, 3)
                },
                "%A": function(e) {
                    return s[e.tm_wday]
                },
                "%b": function(e) {
                    return c[e.tm_mon].substring(0, 3)
                },
                "%B": function(e) {
                    return c[e.tm_mon]
                },
                "%C": function(e) {
                    var i = e.tm_year + 1900;
                    return _(i / 100 | 0, 2)
                },
                "%d": function(e) {
                    return _(e.tm_mday, 2)
                },
                "%e": function(e) {
                    return r(e.tm_mday, 2, " ")
                },
                "%g": function(e) {
                    return l(e).toString().substring(2)
                },
                "%G": function(e) {
                    return l(e)
                },
                "%H": function(e) {
                    return _(e.tm_hour, 2)
                },
                "%I": function(e) {
                    var i = e.tm_hour;
                    return 0 == i ? i = 12 : i > 12 && (i -= 12), _(i, 2)
                },
                "%j": function(e) {
                    return _(e.tm_mday + __arraySum(__isLeapYear(e.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, e.tm_mon - 1), 3)
                },
                "%m": function(e) {
                    return _(e.tm_mon + 1, 2)
                },
                "%M": function(e) {
                    return _(e.tm_min, 2)
                },
                "%n": function() {
                    return "\n"
                },
                "%p": function(e) {
                    return e.tm_hour >= 0 && e.tm_hour < 12 ? "AM" : "PM"
                },
                "%S": function(e) {
                    return _(e.tm_sec, 2)
                },
                "%t": function() {
                    return "	"
                },
                "%u": function(e) {
                    var i = new Date(e.tm_year + 1900, e.tm_mon + 1, e.tm_mday, 0, 0, 0, 0);
                    return i.getDay() || 7
                },
                "%U": function(e) {
                    var i, n, t, r = new Date(e.tm_year + 1900, 0, 1),
                        a = 0 === r.getDay() ? r : __addDays(r, 7 - r.getDay()),
                        l = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
                    return o(a, l) < 0 ? (i = __arraySum(__isLeapYear(l.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, l.getMonth() - 1) - 31, n = 31 - a.getDate(), t = n + i + l.getDate(), _(Math.ceil(t / 7), 2)) : 0 === o(a, r) ? "01" : "00"
                },
                "%V": function(e) {
                    var i, n = new Date(e.tm_year + 1900, 0, 4),
                        t = new Date(e.tm_year + 1901, 0, 4),
                        r = a(n),
                        l = a(t),
                        u = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday);
                    return o(u, r) < 0 ? "53" : o(l, u) <= 0 ? "01" : (i = r.getFullYear() < e.tm_year + 1900 ? e.tm_yday + 32 - r.getDate() : e.tm_yday + 1 - r.getDate(), _(Math.ceil(i / 7), 2))
                },
                "%w": function(e) {
                    var i = new Date(e.tm_year + 1900, e.tm_mon + 1, e.tm_mday, 0, 0, 0, 0);
                    return i.getDay()
                },
                "%W": function(e) {
                    var i, n, t, r = new Date(e.tm_year, 0, 1),
                        a = 1 === r.getDay() ? r : __addDays(r, 0 === r.getDay() ? 1 : 7 - r.getDay() + 1),
                        l = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
                    return o(a, l) < 0 ? (i = __arraySum(__isLeapYear(l.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, l.getMonth() - 1) - 31, n = 31 - a.getDate(), t = n + i + l.getDate(), _(Math.ceil(t / 7), 2)) : 0 === o(a, r) ? "01" : "00"
                },
                "%y": function(e) {
                    return (e.tm_year + 1900).toString().substring(2)
                },
                "%Y": function(e) {
                    return e.tm_year + 1900
                },
                "%z": function(e) {
                    var i = e.tm_gmtoff,
                        n = i >= 0;
                    return i = Math.abs(i) / 60, i = i / 60 * 100 + i % 60, (n ? "+" : "-") + String("0000" + i).slice(-4)
                },
                "%Z": function(e) {
                    return e.tm_zone
                },
                "%%": function() {
                    return "%"
                }
            };
            for (u in f) v.indexOf(u) >= 0 && (v = v.replace(new RegExp(u, "g"), f[u](m)));
            return d = intArrayFromString(v, !1), d.length > i ? 0 : (writeArrayToMemory(d, e), d.length - 1)
        }

        function _sysconf(e) {
            switch (e) {
                case 30:
                    return PAGE_SIZE;
                case 85:
                    var i = 2 * 1024 * 1024 * 1024 - 65536;
                    return i / PAGE_SIZE;
                case 132:
                case 133:
                case 12:
                case 137:
                case 138:
                case 15:
                case 235:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 149:
                case 13:
                case 10:
                case 236:
                case 153:
                case 9:
                case 21:
                case 22:
                case 159:
                case 154:
                case 14:
                case 77:
                case 78:
                case 139:
                case 80:
                case 81:
                case 82:
                case 68:
                case 67:
                case 164:
                case 11:
                case 29:
                case 47:
                case 48:
                case 95:
                case 52:
                case 51:
                case 46:
                    return 200809;
                case 79:
                    return 0;
                case 27:
                case 246:
                case 127:
                case 128:
                case 23:
                case 24:
                case 160:
                case 161:
                case 181:
                case 182:
                case 242:
                case 183:
                case 184:
                case 243:
                case 244:
                case 245:
                case 165:
                case 178:
                case 179:
                case 49:
                case 50:
                case 168:
                case 169:
                case 175:
                case 170:
                case 171:
                case 172:
                case 97:
                case 76:
                case 32:
                case 173:
                case 35:
                    return -1;
                case 176:
                case 177:
                case 7:
                case 155:
                case 8:
                case 157:
                case 125:
                case 126:
                case 92:
                case 93:
                case 129:
                case 130:
                case 131:
                case 94:
                case 91:
                    return 1;
                case 74:
                case 60:
                case 69:
                case 70:
                case 4:
                    return 1024;
                case 31:
                case 42:
                case 72:
                    return 32;
                case 87:
                case 26:
                case 33:
                    return 2147483647;
                case 34:
                case 1:
                    return 47839;
                case 38:
                case 36:
                    return 99;
                case 43:
                case 37:
                    return 2048;
                case 0:
                    return 2097152;
                case 3:
                    return 65536;
                case 28:
                    return 32768;
                case 44:
                    return 32767;
                case 75:
                    return 16384;
                case 39:
                    return 1e3;
                case 89:
                    return 700;
                case 71:
                    return 256;
                case 40:
                    return 255;
                case 2:
                    return 100;
                case 180:
                    return 64;
                case 25:
                    return 20;
                case 5:
                    return 16;
                case 6:
                    return 6;
                case 73:
                    return 4;
                case 84:
                    return "object" == typeof navigator ? navigator["hardwareConcurrency"] || 1 : 1
            }
            return ___setErrNo(ERRNO_CODES.EINVAL), -1
        }

        function _time(e) {
            var i = Date.now() / 1e3 | 0;
            return e && (HEAP32[e >> 2] = i), i
        }

        function _unsetenv(e) {
            return 0 === e ? (___setErrNo(ERRNO_CODES.EINVAL), -1) : (e = Pointer_stringify(e), "" === e || e.indexOf("=") !== -1 ? (___setErrNo(ERRNO_CODES.EINVAL), -1) : (ENV.hasOwnProperty(e) && (delete ENV[e], ___buildEnvironment(__get_environ())), 0))
        }

        function _utime(e, i) {
            var n, t;
            i ? (t = 4, n = HEAP32[i + t >> 2], n *= 1e3) : n = Date.now(), e = Pointer_stringify(e);
            try {
                return FS.utime(e, n, n), 0
            } catch (r) {
                return FS.handleFSError(r), -1
            }
        }

        function intArrayFromString(e, i, n) {
            var t = n > 0 ? n : lengthBytesUTF8(e) + 1,
                r = new Array(t),
                _ = stringToUTF8Array(e, r, 0, r.length);
            return i && (r.length = _), r
        }

        function invoke_dd(e, i) {
            var n = stackSave();
            try {
                return Module["dynCall_dd"](e, i)
            } catch (t) {
                if (stackRestore(n), "number" != typeof t && "longjmp" !== t) throw t;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ddd(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_ddd"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ddddi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_ddddi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_dddi(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_dddi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ddi(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_ddi"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ddii(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_ddii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ddiii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_ddiii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_dfi(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_dfi"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_di(e, i) {
            var n = stackSave();
            try {
                return Module["dynCall_di"](e, i)
            } catch (t) {
                if (stackRestore(n), "number" != typeof t && "longjmp" !== t) throw t;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_diddi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_diddi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_didi(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_didi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_dii(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_dii"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_diidi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_diidi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_diii(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_diii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_diiii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_diiii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_dji(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_dji"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_f(e) {
            var i = stackSave();
            try {
                return Module["dynCall_f"](e)
            } catch (n) {
                if (stackRestore(i), "number" != typeof n && "longjmp" !== n) throw n;
                Module["setThrew"](1, 0);
            }
        }

        function invoke_fdi(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_fdi"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ff(e, i) {
            var n = stackSave();
            try {
                return Module["dynCall_ff"](e, i)
            } catch (t) {
                if (stackRestore(n), "number" != typeof t && "longjmp" !== t) throw t;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fff(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_fff"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ffffffi(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_ffffffi"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fffffi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_fffffi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ffffi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_ffffi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ffffii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_ffffii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fffi(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_fffi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fffifffi(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_fffifffi"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fffifi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_fffifi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ffi(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_ffi"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ffii(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_ffii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fi(e, i) {
            var n = stackSave();
            try {
                return Module["dynCall_fi"](e, i)
            } catch (t) {
                if (stackRestore(n), "number" != typeof t && "longjmp" !== t) throw t;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fif(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_fif"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiff(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_fiff"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiffffii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_fiffffii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiffffiiiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_fiffffiiiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiffffiiiiii(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                return Module["dynCall_fiffffiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fifffi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_fifffi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiffi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_fiffi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fifi(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_fifi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fifii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_fifii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fifiii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_fifiii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fii(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_fii"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiif(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_fiif"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiifi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_fiifi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiifii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_fiifii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiii(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_fiii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiiifi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_fiiifi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiiii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_fiiii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiiiif(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_fiiiif"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiiiiiifiifif(e, i, n, t, r, _, o, a, l, u, s, c, f) {
            var d = stackSave();
            try {
                return Module["dynCall_fiiiiiifiifif"](e, i, n, t, r, _, o, a, l, u, s, c, f)
            } catch (p) {
                if (stackRestore(d), "number" != typeof p && "longjmp" !== p) throw p;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fiiiiiifiiiif(e, i, n, t, r, _, o, a, l, u, s, c, f) {
            var d = stackSave();
            try {
                return Module["dynCall_fiiiiiifiiiif"](e, i, n, t, r, _, o, a, l, u, s, c, f)
            } catch (p) {
                if (stackRestore(d), "number" != typeof p && "longjmp" !== p) throw p;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_fji(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_fji"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_i(e) {
            var i = stackSave();
            try {
                return Module["dynCall_i"](e)
            } catch (n) {
                if (stackRestore(i), "number" != typeof n && "longjmp" !== n) throw n;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_idi(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_idi"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_idiii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_idiii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iffffi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iffffi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ifffi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_ifffi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ifffii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_ifffii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ifffiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_ifffiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iffi(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_iffi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ifi(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_ifi"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ifii(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_ifii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ifiii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_ifiii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ii(e, i) {
            var n = stackSave();
            try {
                return Module["dynCall_ii"](e, i)
            } catch (t) {
                if (stackRestore(n), "number" != typeof t && "longjmp" !== t) throw t;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiddi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_iiddi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iidi(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_iidi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iidii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_iidii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iif(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_iif"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiff(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_iiff"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iifff(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_iifff"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iifffi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iifffi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiffi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_iiffi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiffii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iiffii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiffiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiffiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iifi(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_iifi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iififiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iififiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iifii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_iifii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iifiii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iifiii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iifiiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iifiiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iii(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_iii"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiidii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iiidii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiif(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_iiif"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiifffffffi(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_iiifffffffi"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiffffiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iiiffffiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiifffi(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiifffi"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiifffii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiifffii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiffi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iiiffi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiffii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiiffii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiffiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiiffiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiifi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_iiifi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiifii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iiifii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiifiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiifiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiifiiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiifiiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiii(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_iiii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiifffffi(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iiiifffffi"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiffffiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_iiiiffffiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiffi(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiiiffi"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiffii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiiiffii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiifi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iiiifi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiifii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiiifii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiifiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiiifiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiifiiii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                return Module["dynCall_iiiifiiii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiifiiiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iiiifiiiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_iiiii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiffii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                return Module["dynCall_iiiiiffii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiifi(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiiiifi"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiifii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiiiifii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiifiii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                return Module["dynCall_iiiiifiii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiifiiiif(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_iiiiifiiiif"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiifiiiiif(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                return Module["dynCall_iiiiifiiiiif"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iiiiii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiifffi(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iiiiiifffi"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiifffiiifiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m) {
            var v = stackSave();
            try {
                return Module["dynCall_iiiiiifffiiifiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m)
            } catch (y) {
                if (stackRestore(v), "number" != typeof y && "longjmp" !== y) throw y;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiffiiiiiiiiiffffiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g, S, L, E, h, b) {
            var C = stackSave();
            try {
                return Module["dynCall_iiiiiiffiiiiiiiiiffffiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g, S, L, E, h, b)
            } catch (M) {
                if (stackRestore(C), "number" != typeof M && "longjmp" !== M) throw M;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiffiiiiiiiiiffffiiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g, S, L, E, h, b, C) {
            var M = stackSave();
            try {
                return Module["dynCall_iiiiiiffiiiiiiiiiffffiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g, S, L, E, h, b, C)
            } catch (k) {
                if (stackRestore(M), "number" != typeof k && "longjmp" !== k) throw k;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiffiiiiiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g, S, L, E, h) {
            var b = stackSave();
            try {
                return Module["dynCall_iiiiiiffiiiiiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g, S, L, E, h)
            } catch (C) {
                if (stackRestore(b), "number" != typeof C && "longjmp" !== C) throw C;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiifiif(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iiiiiifiif"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiifiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iiiiiifiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiiiiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiifi(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                return Module["dynCall_iiiiiiifi"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiifii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iiiiiiifii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiifiif(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_iiiiiiifiif"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiiiiiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiiii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                return Module["dynCall_iiiiiiiii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiiiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iiiiiiiiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_iiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                return Module["dynCall_iiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c, f) {
            var d = stackSave();
            try {
                return Module["dynCall_iiiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f)
            } catch (p) {
                if (stackRestore(d), "number" != typeof p && "longjmp" !== p) throw p;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d) {
            var p = stackSave();
            try {
                return Module["dynCall_iiiiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d)
            } catch (m) {
                if (stackRestore(p), "number" != typeof m && "longjmp" !== m) throw m;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiiijjiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d) {
            var p = stackSave();
            try {
                return Module["dynCall_iiiiiiijjiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d)
            } catch (m) {
                if (stackRestore(p), "number" != typeof m && "longjmp" !== m) throw m;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiijjiii(e, i, n, t, r, _, o, a, l, u, s, c, f) {
            var d = stackSave();
            try {
                return Module["dynCall_iiiiiijjiii"](e, i, n, t, r, _, o, a, l, u, s, c, f)
            } catch (p) {
                if (stackRestore(d), "number" != typeof p && "longjmp" !== p) throw p;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiij(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiiiij"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiiji(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiiiiji"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiijiiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_iiiiijiiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiij(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iiiij"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiiji(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiiiji"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiijii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiiijii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiijjii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iiiijjii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiijjiiii(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                return Module["dynCall_iiiijjiiii"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiij(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_iiij"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiiji(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iiiji"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiijii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iiijii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiijiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiijiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiijji(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iiijji"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiijjii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                return Module["dynCall_iiijjii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiijjiiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_iiijjiiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiijjjiii(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                return Module["dynCall_iiijjjiii"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iij(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_iij"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iiji(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_iiji"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iijii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_iijii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iijiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iijiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iijiiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iijiiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iijiiiiiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_iijiiiiiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iijji(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_iijji"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iijjii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_iijjii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iijjiii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                return Module["dynCall_iijjiii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iijjji(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                return Module["dynCall_iijjji"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iijjjii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                return Module["dynCall_iijjjii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ij(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_ij"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_iji(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_iji"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ijiii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_ijiii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ijj(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_ijj"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ijji(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_ijji"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_j(e) {
            var i = stackSave();
            try {
                return Module["dynCall_j"](e)
            } catch (n) {
                if (stackRestore(i), "number" != typeof n && "longjmp" !== n) throw n;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jdi(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_jdi"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jdii(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_jdii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jfi(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_jfi"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_ji(e, i) {
            var n = stackSave();
            try {
                return Module["dynCall_ji"](e, i)
            } catch (t) {
                if (stackRestore(n), "number" != typeof t && "longjmp" !== t) throw t;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jidi(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_jidi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jidii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_jidii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jii(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_jii"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jiii(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_jiii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jiiii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_jiiii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jiiiii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_jiiiii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jiiiiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_jiiiiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0);
            }
        }

        function invoke_jiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                return Module["dynCall_jiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jiiji(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_jiiji"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jiijii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_jiijii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jiji(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_jiji"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jijii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_jijii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jijiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_jijiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jijj(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                return Module["dynCall_jijj"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jijji(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                return Module["dynCall_jijji"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jj(e, i, n) {
            var t = stackSave();
            try {
                return Module["dynCall_jj"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jji(e, i, n, t) {
            var r = stackSave();
            try {
                return Module["dynCall_jji"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jjii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                return Module["dynCall_jjii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_jjjji(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                return Module["dynCall_jjjji"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_v(e) {
            var i = stackSave();
            try {
                Module["dynCall_v"](e)
            } catch (n) {
                if (stackRestore(i), "number" != typeof n && "longjmp" !== n) throw n;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vd(e, i) {
            var n = stackSave();
            try {
                Module["dynCall_vd"](e, i)
            } catch (t) {
                if (stackRestore(n), "number" != typeof t && "longjmp" !== t) throw t;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vdii(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_vdii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vf(e, i) {
            var n = stackSave();
            try {
                Module["dynCall_vf"](e, i)
            } catch (t) {
                if (stackRestore(n), "number" != typeof t && "longjmp" !== t) throw t;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vff(e, i, n) {
            var t = stackSave();
            try {
                Module["dynCall_vff"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vfff(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_vfff"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vffff(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_vffff"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vffffi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_vffffi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vfffi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_vfffi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vfi(e, i, n) {
            var t = stackSave();
            try {
                Module["dynCall_vfi"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vfif(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_vfif"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vfifi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_vfifi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vfii(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_vfii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vfiii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_vfiii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vi(e, i) {
            var n = stackSave();
            try {
                Module["dynCall_vi"](e, i)
            } catch (t) {
                if (stackRestore(n), "number" != typeof t && "longjmp" !== t) throw t;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vid(e, i, n) {
            var t = stackSave();
            try {
                Module["dynCall_vid"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vidd(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_vidd"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viddi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_viddi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vidi(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_vidi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vif(e, i, n) {
            var t = stackSave();
            try {
                Module["dynCall_vif"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viff(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_viff"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vifff(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_vifff"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viffff(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viffff"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viffffffi(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viffffffi"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viffffi(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viffffi"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viffffii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viffffii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viffffiii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viffffiii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viffffiiiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                Module["dynCall_viffffiiiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vifffi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_vifffi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vifffii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_vifffii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viffi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_viffi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viffii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viffii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viffiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viffiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vifi(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_vifi"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vififi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_vififi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vififififii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                Module["dynCall_vififififii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vifii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_vifii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vifiii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_vifiii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vifiiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_vifiiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vii(e, i, n) {
            var t = stackSave();
            try {
                Module["dynCall_vii"](e, i, n)
            } catch (r) {
                if (stackRestore(t), "number" != typeof r && "longjmp" !== r) throw r;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viid(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_viid"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiddi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viiddi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viidi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_viidi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viidii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viidii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viif(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_viif"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiff(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_viiff"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viifff(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viifff"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiffffffi(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiffffffi"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiffffi(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiffffi"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiffffii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viiffffii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiffffiiiii(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                Module["dynCall_viiffffiiiii"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viifffi(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viifffi"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viifffiiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viifffiiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiffi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viiffi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiffii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viiffii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiffiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiffiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiffiiiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiffiiiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viifi(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_viifi"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viififififii(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                Module["dynCall_viififififii"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viifii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viifii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viifiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viifiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viifiiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viifiiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viii(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_viii"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiidi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viiidi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiif(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_viiif"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiffffffffii(e, i, n, t, r, _, o, a, l, u, s, c, f, d) {
            var p = stackSave();
            try {
                Module["dynCall_viiiffffffffii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d)
            } catch (m) {
                if (stackRestore(p), "number" != typeof m && "longjmp" !== m) throw m;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiifffi(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiifffi"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiffi(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viiiffi"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiffii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiiffii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiifi(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viiifi"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiififfi(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viiififfi"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiififi(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiififi"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiifii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viiifii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiifiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiifiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiifiiiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiifiiiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_viiii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiif(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viiiif"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiffi(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiiiffi"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiffii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viiiiffii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiifi(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viiiifi"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiifii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiiifii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiifiiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiiifiiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiifiiiiif(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                Module["dynCall_viiiifiiiiif"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viiiii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiif(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viiiiif"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiifffi(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiiiifffi"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiffi(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viiiiiffi"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiffii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiiiiffii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiifi(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiiiifi"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viiiiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiif(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiiiiif"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiffi(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiiiiiffi"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiiiiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiifi(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiiiiiifi"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viiiiiiii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiifi(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                Module["dynCall_viiiiiiiifi"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiiiiiiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                Module["dynCall_viiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                Module["dynCall_viiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiiiiifii(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p) {
            var m = stackSave();
            try {
                Module["dynCall_viiiiiiiiiiifii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p)
            } catch (v) {
                if (stackRestore(m), "number" != typeof v && "longjmp" !== v) throw v;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c, f) {
            var d = stackSave();
            try {
                Module["dynCall_viiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f)
            } catch (p) {
                if (stackRestore(d), "number" != typeof p && "longjmp" !== p) throw p;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d) {
            var p = stackSave();
            try {
                Module["dynCall_viiiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d)
            } catch (m) {
                if (stackRestore(p), "number" != typeof m && "longjmp" !== m) throw m;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p) {
            var m = stackSave();
            try {
                Module["dynCall_viiiiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p)
            } catch (v) {
                if (stackRestore(m), "number" != typeof v && "longjmp" !== v) throw v;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m) {
            var v = stackSave();
            try {
                Module["dynCall_viiiiiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m)
            } catch (y) {
                if (stackRestore(v), "number" != typeof y && "longjmp" !== y) throw y;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g) {
            var S = stackSave();
            try {
                Module["dynCall_viiiiiiiiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g)
            } catch (L) {
                if (stackRestore(S), "number" != typeof L && "longjmp" !== L) throw L;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiiiiiiiji(e, i, n, t, r, _, o, a, l, u, s, c, f) {
            var d = stackSave();
            try {
                Module["dynCall_viiiiiiiiiji"](e, i, n, t, r, _, o, a, l, u, s, c, f)
            } catch (p) {
                if (stackRestore(d), "number" != typeof p && "longjmp" !== p) throw p;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiijii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viiiijii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiijiiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                Module["dynCall_viiiijiiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiijjiii(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                Module["dynCall_viiiijjiii"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiiji(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viiiji"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiijii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viiijii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiijiii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viiijiii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiijiiifi(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                Module["dynCall_viiijiiifi"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiijiiijji(e, i, n, t, r, _, o, a, l, u, s, c, f, d) {
            var p = stackSave();
            try {
                Module["dynCall_viiijiiijji"](e, i, n, t, r, _, o, a, l, u, s, c, f, d)
            } catch (m) {
                if (stackRestore(p), "number" != typeof m && "longjmp" !== m) throw m;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiijji(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viiijji"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiijjii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viiijjii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiijjiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                Module["dynCall_viiijjiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiijjiijji(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p) {
            var m = stackSave();
            try {
                Module["dynCall_viiijjiijji"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p)
            } catch (v) {
                if (stackRestore(m), "number" != typeof v && "longjmp" !== v) throw v;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiijjiijjji(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v) {
            var y = stackSave();
            try {
                Module["dynCall_viiijjiijjji"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v)
            } catch (g) {
                if (stackRestore(y), "number" != typeof g && "longjmp" !== g) throw g;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viij(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_viij"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viiji(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_viiji"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_viijii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijiii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viijiii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijiiiiiiiiiii(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m) {
            var v = stackSave();
            try {
                Module["dynCall_viijiiiiiiiiiii"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m)
            } catch (y) {
                if (stackRestore(v), "number" != typeof y && "longjmp" !== y) throw y;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijiiijji(e, i, n, t, r, _, o, a, l, u, s, c, f) {
            var d = stackSave();
            try {
                Module["dynCall_viijiiijji"](e, i, n, t, r, _, o, a, l, u, s, c, f)
            } catch (p) {
                if (stackRestore(d), "number" != typeof p && "longjmp" !== p) throw p;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijiiijjji(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p) {
            var m = stackSave();
            try {
                Module["dynCall_viijiiijjji"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p)
            } catch (v) {
                if (stackRestore(m), "number" != typeof v && "longjmp" !== v) throw v;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijiijiii(e, i, n, t, r, _, o, a, l, u, s, c) {
            var f = stackSave();
            try {
                Module["dynCall_viijiijiii"](e, i, n, t, r, _, o, a, l, u, s, c)
            } catch (d) {
                if (stackRestore(f), "number" != typeof d && "longjmp" !== d) throw d;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijijii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viijijii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijijiii(e, i, n, t, r, _, o, a, l, u, s) {
            var c = stackSave();
            try {
                Module["dynCall_viijijiii"](e, i, n, t, r, _, o, a, l, u, s)
            } catch (f) {
                if (stackRestore(c), "number" != typeof f && "longjmp" !== f) throw f;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijji(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_viijji"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijjii(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_viijjii"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijjiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viijjiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viijjji(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_viijjji"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vij(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_vij"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_viji(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_viji"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vijii(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_vijii"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vijiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_vijiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vijiiiiii(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_vijiiiiii"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vijiijjiijjji(e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g) {
            var S = stackSave();
            try {
                Module["dynCall_vijiijjiijjji"](e, i, n, t, r, _, o, a, l, u, s, c, f, d, p, m, v, y, g)
            } catch (L) {
                if (stackRestore(S), "number" != typeof L && "longjmp" !== L) throw L;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vijiji(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_vijiji"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vijijji(e, i, n, t, r, _, o, a, l, u) {
            var s = stackSave();
            try {
                Module["dynCall_vijijji"](e, i, n, t, r, _, o, a, l, u)
            } catch (c) {
                if (stackRestore(s), "number" != typeof c && "longjmp" !== c) throw c;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vijji(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_vijji"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vijjii(e, i, n, t, r, _, o, a) {
            var l = stackSave();
            try {
                Module["dynCall_vijjii"](e, i, n, t, r, _, o, a)
            } catch (u) {
                if (stackRestore(l), "number" != typeof u && "longjmp" !== u) throw u;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vijjji(e, i, n, t, r, _, o, a, l) {
            var u = stackSave();
            try {
                Module["dynCall_vijjji"](e, i, n, t, r, _, o, a, l)
            } catch (s) {
                if (stackRestore(u), "number" != typeof s && "longjmp" !== s) throw s;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vji(e, i, n, t) {
            var r = stackSave();
            try {
                Module["dynCall_vji"](e, i, n, t)
            } catch (_) {
                if (stackRestore(r), "number" != typeof _ && "longjmp" !== _) throw _;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vjii(e, i, n, t, r) {
            var _ = stackSave();
            try {
                Module["dynCall_vjii"](e, i, n, t, r)
            } catch (o) {
                if (stackRestore(_), "number" != typeof o && "longjmp" !== o) throw o;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vjiiii(e, i, n, t, r, _, o) {
            var a = stackSave();
            try {
                Module["dynCall_vjiiii"](e, i, n, t, r, _, o)
            } catch (l) {
                if (stackRestore(a), "number" != typeof l && "longjmp" !== l) throw l;
                Module["setThrew"](1, 0)
            }
        }

        function invoke_vjji(e, i, n, t, r, _) {
            var o = stackSave();
            try {
                Module["dynCall_vjji"](e, i, n, t, r, _)
            } catch (a) {
                if (stackRestore(o), "number" != typeof a && "longjmp" !== a) throw a;
                Module["setThrew"](1, 0)
            }
        }

        function ExitStatus(e) {
            this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e
        }

        function run(e) {
            function i() {
                Module["calledRun"] || (Module["calledRun"] = !0, ABORT || (ensureInitRuntime(), preMain(), Module["onRuntimeInitialized"] && Module["onRuntimeInitialized"](), Module["_main"] && shouldRunNow && Module["callMain"](e), postRun()))
            }
            e = e || Module["arguments"], runDependencies > 0 || (preRun(), runDependencies > 0 || Module["calledRun"] || (Module["setStatus"] ? (Module["setStatus"]("Running..."), setTimeout(function() {
                setTimeout(function() {
                    Module["setStatus"]("")
                }, 1), i()
            }, 1)) : i()))
        }

        function exit(e, i) {
            i && Module["noExitRuntime"] && 0 === e || (Module["noExitRuntime"] || (ABORT = !0, EXITSTATUS = e, STACKTOP = initialStackTop, exitRuntime(), Module["onExit"] && Module["onExit"](e)), Module["quit"](e, new ExitStatus(e)))
        }

        function abort(e) {
            throw Module["onAbort"] && Module["onAbort"](e), undefined !== e ? (out(e), err(e), e = JSON.stringify(e)) : e = "", ABORT = !0, EXITSTATUS = 1, "abort(" + e + "). Build with -s ASSERTIONS=1 for more info."
        }
        var Module, unityMapSource, MediaDevices, moduleOverrides, key, ENVIRONMENT_IS_WEB, ENVIRONMENT_IS_WORKER, ENVIRONMENT_IS_NODE, ENVIRONMENT_IS_SHELL, scriptDirectory, nodeFS, nodePath, out, err, STACK_ALIGN, asm2wasmImports, jsCallStartIndex, functionPointers, funcWrappers, GLOBAL_BASE, ABORT, EXITSTATUS, JSfuncs, toC, ALLOC_NORMAL, ALLOC_STACK, ALLOC_STATIC, ALLOC_NONE, UTF8Decoder, UTF16Decoder, PAGE_SIZE, WASM_PAGE_SIZE, ASMJS_PAGE_SIZE, MIN_TOTAL_MEMORY, buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64, STATIC_BASE, STATICTOP, staticSealed, STACK_BASE, STACKTOP, STACK_MAX, DYNAMIC_BASE, DYNAMICTOP_PTR, byteLength, TOTAL_STACK, TOTAL_MEMORY, __ATPRERUN__, __ATINIT__, __ATMAIN__, __ATEXIT__, __ATPOSTRUN__, runtimeInitialized, runtimeExited, Math_abs, Math_sqrt, Math_ceil, Math_floor, Math_pow, Math_min, Math_clz32, Math_trunc, runDependencies, runDependencyWatcher, dependenciesFulfilled, dataURIPrefix, ASM_CONSTS, STATIC_BUMP, tempDoublePtr, fs, WEBAudio, UNETWebSocketsInstances, wr, ENV, EXCEPTIONS, ERRNO_CODES, ERRNO_MESSAGES, PATH, TTY, MEMFS, IDBFS, NODEFS, WORKERFS, FS, SYSCALLS, SOCKFS, DNS, PROCINFO, PIPEFS, DLFCN, Browser, JSEvents, __currentFullscreenStrategy, GL, ___tm_current, ___tm_timezone, _llvm_ceil_f32, _llvm_ceil_f64, _llvm_fabs_f32, _llvm_fabs_f64, _llvm_floor_f32, _llvm_floor_f64, _llvm_pow_f64, _llvm_sqrt_f32, _llvm_trunc_f32, PTHREAD_SPECIFIC, PTHREAD_SPECIFIC_NEXT_KEY, __MONTH_DAYS_LEAP, __MONTH_DAYS_REGULAR, NODEJS_PATH, GLctx, asm, _SendMessage, _SendMessageFloat, _SendMessageString, _SetFullscreen, __GLOBAL__sub_I_AIScriptingClasses_cpp, __GLOBAL__sub_I_ARScriptingClasses_cpp, __GLOBAL__sub_I_AccessibilityScriptingClasses_cpp, __GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp, __GLOBAL__sub_I_AndroidPermissions_bindings_cpp, __GLOBAL__sub_I_AnimationClip_cpp, __GLOBAL__sub_I_AnimationScriptingClasses_cpp, __GLOBAL__sub_I_AssetBundleFileSystem_cpp, __GLOBAL__sub_I_AssetBundleScriptingClasses_cpp, __GLOBAL__sub_I_AudioScriptingClasses_cpp, __GLOBAL__sub_I_Avatar_cpp, __GLOBAL__sub_I_ClothScriptingClasses_cpp, __GLOBAL__sub_I_ConstraintManager_cpp, __GLOBAL__sub_I_DirectorScriptingClasses_cpp, __GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp, __GLOBAL__sub_I_External_Yoga_Yoga_0_cpp, __GLOBAL__sub_I_GfxDeviceNull_cpp, __GLOBAL__sub_I_GridScriptingClasses_cpp, __GLOBAL__sub_I_IMGUIScriptingClasses_cpp, __GLOBAL__sub_I_Il2CppCodeRegistration_cpp, __GLOBAL__sub_I_InputLegacyScriptingClasses_cpp, __GLOBAL__sub_I_InputScriptingClasses_cpp, __GLOBAL__sub_I_LogAssert_cpp, __GLOBAL__sub_I_Lump_libil2cpp_gc_cpp, __GLOBAL__sub_I_Lump_libil2cpp_metadata_cpp, __GLOBAL__sub_I_Lump_libil2cpp_os_cpp, __GLOBAL__sub_I_Lump_libil2cpp_utils_cpp, __GLOBAL__sub_I_Lump_libil2cpp_vm_cpp, __GLOBAL__sub_I_Modules_Animation_1_cpp, __GLOBAL__sub_I_Modules_Animation_3_cpp, __GLOBAL__sub_I_Modules_Animation_6_cpp, __GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp, __GLOBAL__sub_I_Modules_Audio_Public_0_cpp, __GLOBAL__sub_I_Modules_Audio_Public_1_cpp, __GLOBAL__sub_I_Modules_Audio_Public_3_cpp, __GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_0_cpp, __GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp, __GLOBAL__sub_I_Modules_Cloth_0_cpp, __GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp, __GLOBAL__sub_I_Modules_Grid_Public_0_cpp, __GLOBAL__sub_I_Modules_IMGUI_0_cpp, __GLOBAL__sub_I_Modules_IMGUI_1_cpp, __GLOBAL__sub_I_Modules_Input_Private_0_cpp, __GLOBAL__sub_I_Modules_ParticleSystem_Modules_3_cpp, __GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp, __GLOBAL__sub_I_Modules_Physics2D_Public_1_cpp, __GLOBAL__sub_I_Modules_Physics_0_cpp, __GLOBAL__sub_I_Modules_Physics_1_cpp, __GLOBAL__sub_I_Modules_Profiler_Public_0_cpp, __GLOBAL__sub_I_Modules_Terrain_Public_0_cpp, __GLOBAL__sub_I_Modules_Terrain_Public_1_cpp, __GLOBAL__sub_I_Modules_Terrain_Public_2_cpp, __GLOBAL__sub_I_Modules_Terrain_Public_3_cpp, __GLOBAL__sub_I_Modules_Terrain_VR_0_cpp, __GLOBAL__sub_I_Modules_TextCore_Native_FontEngine_0_cpp, __GLOBAL__sub_I_Modules_TextRendering_Public_1_cpp, __GLOBAL__sub_I_Modules_Tilemap_0_cpp, __GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp, __GLOBAL__sub_I_Modules_UI_0_cpp, __GLOBAL__sub_I_Modules_UI_1_cpp, __GLOBAL__sub_I_Modules_UI_2_cpp, __GLOBAL__sub_I_Modules_UnityAnalytics_Dispatcher_0_cpp, __GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp, __GLOBAL__sub_I_Modules_VFX_Public_1_cpp, __GLOBAL__sub_I_Modules_VFX_Public_2_cpp, __GLOBAL__sub_I_Modules_VR_2_cpp, __GLOBAL__sub_I_Modules_VR_PluginInterface_0_cpp, __GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp, __GLOBAL__sub_I_NvCloth_src_0_cpp, __GLOBAL__sub_I_NvCloth_src_1_cpp, __GLOBAL__sub_I_ParticleSystemRenderer_cpp, __GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp, __GLOBAL__sub_I_Physics2DScriptingClasses_cpp, __GLOBAL__sub_I_PhysicsQuery_cpp, __GLOBAL__sub_I_PhysicsScriptingClasses_cpp, __GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Platforms_WebGL_Source_PAL_0_cpp, __GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp, __GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp, __GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp, __GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp, __GLOBAL__sub_I_Runtime_Allocator_1_cpp, __GLOBAL__sub_I_Runtime_Application_0_cpp, __GLOBAL__sub_I_Runtime_BaseClasses_0_cpp, __GLOBAL__sub_I_Runtime_BaseClasses_1_cpp, __GLOBAL__sub_I_Runtime_BaseClasses_2_cpp, __GLOBAL__sub_I_Runtime_BaseClasses_3_cpp, __GLOBAL__sub_I_Runtime_Burst_0_cpp, __GLOBAL__sub_I_Runtime_Camera_0_cpp, __GLOBAL__sub_I_Runtime_Camera_1_cpp, __GLOBAL__sub_I_Runtime_Camera_2_cpp, __GLOBAL__sub_I_Runtime_Camera_3_cpp, __GLOBAL__sub_I_Runtime_Camera_4_cpp, __GLOBAL__sub_I_Runtime_Camera_5_cpp, __GLOBAL__sub_I_Runtime_Camera_6_cpp, __GLOBAL__sub_I_Runtime_Camera_7_cpp, __GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp, __GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp, __GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp, __GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp, __GLOBAL__sub_I_Runtime_Containers_0_cpp, __GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp, __GLOBAL__sub_I_Runtime_Director_Core_1_cpp, __GLOBAL__sub_I_Runtime_File_0_cpp, __GLOBAL__sub_I_Runtime_Geometry_2_cpp, __GLOBAL__sub_I_Runtime_GfxDevice_1_cpp, __GLOBAL__sub_I_Runtime_GfxDevice_2_cpp, __GLOBAL__sub_I_Runtime_GfxDevice_3_cpp, __GLOBAL__sub_I_Runtime_GfxDevice_4_cpp, __GLOBAL__sub_I_Runtime_GfxDevice_5_cpp, __GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp, __GLOBAL__sub_I_Runtime_Graphics_0_cpp, __GLOBAL__sub_I_Runtime_Graphics_10_cpp, __GLOBAL__sub_I_Runtime_Graphics_11_cpp, __GLOBAL__sub_I_Runtime_Graphics_1_cpp, __GLOBAL__sub_I_Runtime_Graphics_5_cpp, __GLOBAL__sub_I_Runtime_Graphics_6_cpp, __GLOBAL__sub_I_Runtime_Graphics_7_cpp, __GLOBAL__sub_I_Runtime_Graphics_8_cpp, __GLOBAL__sub_I_Runtime_Graphics_9_cpp, __GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp, __GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp, __GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp, __GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp, __GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp, __GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp, __GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp, __GLOBAL__sub_I_Runtime_Input_0_cpp, __GLOBAL__sub_I_Runtime_Interfaces_0_cpp, __GLOBAL__sub_I_Runtime_Interfaces_1_cpp, __GLOBAL__sub_I_Runtime_Interfaces_2_cpp, __GLOBAL__sub_I_Runtime_Jobs_0_cpp, __GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp, __GLOBAL__sub_I_Runtime_Math_2_cpp, __GLOBAL__sub_I_Runtime_Math_Random_0_cpp, __GLOBAL__sub_I_Runtime_Misc_0_cpp, __GLOBAL__sub_I_Runtime_Misc_2_cpp, __GLOBAL__sub_I_Runtime_Misc_4_cpp, __GLOBAL__sub_I_Runtime_Misc_5_cpp, __GLOBAL__sub_I_Runtime_Modules_0_cpp, __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp, __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp, __GLOBAL__sub_I_Runtime_PluginInterface_0_cpp, __GLOBAL__sub_I_Runtime_PreloadManager_0_cpp, __GLOBAL__sub_I_Runtime_Profiler_0_cpp, __GLOBAL__sub_I_Runtime_Profiler_2_cpp, __GLOBAL__sub_I_Runtime_SceneManager_0_cpp, __GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp, __GLOBAL__sub_I_Runtime_Scripting_0_cpp, __GLOBAL__sub_I_Runtime_Scripting_2_cpp, __GLOBAL__sub_I_Runtime_Scripting_3_cpp, __GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp, __GLOBAL__sub_I_Runtime_Serialize_2_cpp, __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp, __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp, __GLOBAL__sub_I_Runtime_Shaders_0_cpp, __GLOBAL__sub_I_Runtime_Shaders_2_cpp, __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp, __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp, __GLOBAL__sub_I_Runtime_Transform_0_cpp, __GLOBAL__sub_I_Runtime_Transform_1_cpp, __GLOBAL__sub_I_Runtime_Utilities_2_cpp, __GLOBAL__sub_I_Runtime_Utilities_5_cpp, __GLOBAL__sub_I_Runtime_Utilities_6_cpp, __GLOBAL__sub_I_Runtime_Utilities_7_cpp, __GLOBAL__sub_I_Runtime_Utilities_9_cpp, __GLOBAL__sub_I_Runtime_Video_0_cpp, __GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp, __GLOBAL__sub_I_Shader_cpp, __GLOBAL__sub_I_Shadows_cpp, __GLOBAL__sub_I_ShapeModule_cpp, __GLOBAL__sub_I_SpriteRendererJobs_cpp, __GLOBAL__sub_I_TerrainScriptingClasses_cpp, __GLOBAL__sub_I_TextCoreScriptingClasses_cpp, __GLOBAL__sub_I_TextRenderingScriptingClasses_cpp, __GLOBAL__sub_I_TilemapScriptingClasses_cpp, __GLOBAL__sub_I_Transform_cpp, __GLOBAL__sub_I_UIElementsScriptingClasses_cpp, __GLOBAL__sub_I_UIScriptingClasses_cpp, __GLOBAL__sub_I_UnityAdsSettings_cpp, __GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp, __GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp, __GLOBAL__sub_I_UnsafeUtility_bindings_cpp, __GLOBAL__sub_I_VFXScriptingClasses_cpp, __GLOBAL__sub_I_VRScriptingClasses_cpp, __GLOBAL__sub_I_VideoScriptingClasses_cpp, __GLOBAL__sub_I_Wind_cpp, __GLOBAL__sub_I_XRScriptingClasses_cpp, __GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp, __GLOBAL__sub_I_artifacts_WebGL_modules_Core_WebGL_asmjs_nondev_i_r_nothreads_3_cpp, __GLOBAL__sub_I_umbra_cpp, ___cxa_can_catch, ___cxa_is_pointer_type, ___cxx_global_var_init, ___cxx_global_var_init_129, ___cxx_global_var_init_18, ___cxx_global_var_init_18_4873, ___cxx_global_var_init_19, ___cxx_global_var_init_20, ___cxx_global_var_init_22, ___cxx_global_var_init_2_9458, ___cxx_global_var_init_3096, ___cxx_global_var_init_4_834, ___cxx_global_var_init_51, ___cxx_global_var_init_66, ___emscripten_environ_constructor, ___errno_location, __get_daylight, __get_environ, __get_timezone, __get_tzname, _emscripten_replace_memory, _free, _htonl, _htons, _i64Add, _llvm_bswap_i16, _llvm_bswap_i32, _llvm_ctlz_i64, _llvm_maxnum_f32, _llvm_maxnum_f64, _llvm_minnum_f32, _llvm_round_f32, _main, _malloc, _memalign, _memcpy, _memmove, _memset, _ntohs, _pthread_cond_broadcast, _pthread_mutex_lock, _pthread_mutex_unlock, _realloc, _saveSetjmp, _sbrk, _strlen, _testSetjmp, establishStackSpace, getTempRet0, runPostSets, setTempRet0, setThrew, stackAlloc, stackRestore, stackSave, dynCall_dd, dynCall_ddd, dynCall_ddddi, dynCall_dddi, dynCall_ddi, dynCall_ddii, dynCall_ddiii, dynCall_dfi, dynCall_di, dynCall_diddi, dynCall_didi, dynCall_dii, dynCall_diidi, dynCall_diii, dynCall_diiii, dynCall_dji, dynCall_f, dynCall_fdi, dynCall_ff, dynCall_fff, dynCall_ffffffi, dynCall_fffffi, dynCall_ffffi, dynCall_ffffii, dynCall_fffi, dynCall_fffifffi, dynCall_fffifi, dynCall_ffi, dynCall_ffii, dynCall_fi, dynCall_fif, dynCall_fiff, dynCall_fiffffii, dynCall_fiffffiiiii, dynCall_fiffffiiiiii, dynCall_fifffi, dynCall_fiffi, dynCall_fifi, dynCall_fifii, dynCall_fifiii, dynCall_fii, dynCall_fiif, dynCall_fiifi, dynCall_fiifii, dynCall_fiii, dynCall_fiiifi, dynCall_fiiii, dynCall_fiiiif, dynCall_fiiiiiifiifif, dynCall_fiiiiiifiiiif, dynCall_fji, dynCall_i, dynCall_idi, dynCall_idiii, dynCall_iffffi, dynCall_ifffi, dynCall_ifffii, dynCall_ifffiii, dynCall_iffi, dynCall_ifi, dynCall_ifii, dynCall_ifiii, dynCall_ii, dynCall_iiddi, dynCall_iidi, dynCall_iidii, dynCall_iif, dynCall_iiff, dynCall_iifff, dynCall_iifffi, dynCall_iiffi, dynCall_iiffii, dynCall_iiffiii, dynCall_iifi, dynCall_iififiii, dynCall_iifii, dynCall_iifiii, dynCall_iifiiii, dynCall_iii, dynCall_iiidii, dynCall_iiif, dynCall_iiifffffffi, dynCall_iiiffffiii, dynCall_iiifffi, dynCall_iiifffii, dynCall_iiiffi, dynCall_iiiffii, dynCall_iiiffiii, dynCall_iiifi, dynCall_iiifii, dynCall_iiifiii, dynCall_iiifiiii, dynCall_iiii, dynCall_iiiifffffi, dynCall_iiiiffffiii, dynCall_iiiiffi, dynCall_iiiiffii, dynCall_iiiifi, dynCall_iiiifii, dynCall_iiiifiii, dynCall_iiiifiiii, dynCall_iiiifiiiii, dynCall_iiiii, dynCall_iiiiiffii, dynCall_iiiiifi, dynCall_iiiiifii, dynCall_iiiiifiii, dynCall_iiiiifiiiif, dynCall_iiiiifiiiiif, dynCall_iiiiii, dynCall_iiiiiifffi, dynCall_iiiiiifffiiifiii, dynCall_iiiiiiffiiiiiiiiiffffiii, dynCall_iiiiiiffiiiiiiiiiffffiiii, dynCall_iiiiiiffiiiiiiiiiiiiiii, dynCall_iiiiiifiif, dynCall_iiiiiifiii, dynCall_iiiiiii, dynCall_iiiiiiifi, dynCall_iiiiiiifii, dynCall_iiiiiiifiif, dynCall_iiiiiiii, dynCall_iiiiiiiii, dynCall_iiiiiiiiii, dynCall_iiiiiiiiiii, dynCall_iiiiiiiiiiii, dynCall_iiiiiiiiiiiii, dynCall_iiiiiiiiiiiiii, dynCall_iiiiiiijjiii, dynCall_iiiiiijjiii, dynCall_iiiiij, dynCall_iiiiiji, dynCall_iiiiijiiii, dynCall_iiiij, dynCall_iiiiji, dynCall_iiiijii, dynCall_iiiijjii, dynCall_iiiijjiiii, dynCall_iiij, dynCall_iiiji, dynCall_iiijii, dynCall_iiijiii, dynCall_iiijji, dynCall_iiijjii, dynCall_iiijjiiii, dynCall_iiijjjiii, dynCall_iij, dynCall_iiji, dynCall_iijii, dynCall_iijiii, dynCall_iijiiii, dynCall_iijiiiiiii, dynCall_iijji, dynCall_iijjii, dynCall_iijjiii, dynCall_iijjji, dynCall_iijjjii, dynCall_ij, dynCall_iji, dynCall_ijiii, dynCall_ijj, dynCall_ijji, dynCall_j, dynCall_jdi, dynCall_jdii, dynCall_jfi, dynCall_ji, dynCall_jidi, dynCall_jidii, dynCall_jii, dynCall_jiii, dynCall_jiiii, dynCall_jiiiii, dynCall_jiiiiii, dynCall_jiiiiiiiiii, dynCall_jiiji, dynCall_jiijii, dynCall_jiji, dynCall_jijii, dynCall_jijiii, dynCall_jijj, dynCall_jijji, dynCall_jj, dynCall_jji, dynCall_jjii, dynCall_jjjji, dynCall_v, dynCall_vd, dynCall_vdii, dynCall_vf, dynCall_vff, dynCall_vfff, dynCall_vffff, dynCall_vffffi, dynCall_vfffi, dynCall_vfi, dynCall_vfif, dynCall_vfifi, dynCall_vfii, dynCall_vfiii, dynCall_vi, dynCall_vid, dynCall_vidd, dynCall_viddi, dynCall_vidi, dynCall_vif, dynCall_viff, dynCall_vifff, dynCall_viffff, dynCall_viffffffi, dynCall_viffffi, dynCall_viffffii, dynCall_viffffiii, dynCall_viffffiiiii, dynCall_vifffi, dynCall_vifffii, dynCall_viffi, dynCall_viffii, dynCall_viffiii, dynCall_vifi, dynCall_vififi, dynCall_vififififii, dynCall_vifii, dynCall_vifiii, dynCall_vifiiii, dynCall_vii, dynCall_viid, dynCall_viiddi, dynCall_viidi, dynCall_viidii, dynCall_viif, dynCall_viiff, dynCall_viifff, dynCall_viiffffffi, dynCall_viiffffi, dynCall_viiffffii, dynCall_viiffffiiiii, dynCall_viifffi, dynCall_viifffiiii, dynCall_viiffi, dynCall_viiffii, dynCall_viiffiii, dynCall_viiffiiiii, dynCall_viifi, dynCall_viififififii, dynCall_viifii, dynCall_viifiii, dynCall_viifiiii, dynCall_viii, dynCall_viiidi, dynCall_viiif, dynCall_viiiffffffffii, dynCall_viiifffi, dynCall_viiiffi, dynCall_viiiffii, dynCall_viiifi, dynCall_viiififfi, dynCall_viiififi, dynCall_viiifii, dynCall_viiifiii, dynCall_viiifiiiii, dynCall_viiii, dynCall_viiiif, dynCall_viiiiffi, dynCall_viiiiffii, dynCall_viiiifi, dynCall_viiiifii, dynCall_viiiifiiii, dynCall_viiiifiiiiif, dynCall_viiiii, dynCall_viiiiif, dynCall_viiiiifffi, dynCall_viiiiiffi, dynCall_viiiiiffii, dynCall_viiiiifi, dynCall_viiiiii, dynCall_viiiiiif, dynCall_viiiiiiffi, dynCall_viiiiiii, dynCall_viiiiiiifi, dynCall_viiiiiiii, dynCall_viiiiiiiifi, dynCall_viiiiiiiii, dynCall_viiiiiiiiii, dynCall_viiiiiiiiiii, dynCall_viiiiiiiiiiifii, dynCall_viiiiiiiiiiii, dynCall_viiiiiiiiiiiii, dynCall_viiiiiiiiiiiiii, dynCall_viiiiiiiiiiiiiii, dynCall_viiiiiiiiiiiiiiiiii, dynCall_viiiiiiiiiji, dynCall_viiiijii, dynCall_viiiijiiii, dynCall_viiiijjiii, dynCall_viiiji, dynCall_viiijii, dynCall_viiijiii, dynCall_viiijiiifi, dynCall_viiijiiijji, dynCall_viiijji, dynCall_viiijjii, dynCall_viiijjiii, dynCall_viiijjiijji, dynCall_viiijjiijjji, dynCall_viij, dynCall_viiji, dynCall_viijii, dynCall_viijiii, dynCall_viijiiiiiiiiiii, dynCall_viijiiijji, dynCall_viijiiijjji, dynCall_viijiijiii, dynCall_viijijii, dynCall_viijijiii, dynCall_viijji, dynCall_viijjii, dynCall_viijjiii, dynCall_viijjji, dynCall_vij, dynCall_viji, dynCall_vijii, dynCall_vijiii, dynCall_vijiiiiii, dynCall_vijiijjiijjji, dynCall_vijiji, dynCall_vijijji, dynCall_vijji, dynCall_vijjii, dynCall_vijjji, dynCall_vji, dynCall_vjii, dynCall_vjiiii, dynCall_vjji, initialStackTop, calledMain, shouldRunNow;
        UnityModule = UnityModule || {}, Module = "undefined" != typeof UnityModule ? UnityModule : {}, "undefined" != typeof ENVIRONMENT_IS_PTHREAD && ENVIRONMENT_IS_PTHREAD || (CachedXMLHttpRequest.XMLHttpRequest = window.XMLHttpRequest, CachedXMLHttpRequest.log = function(e) {
            Module.CachedXMLHttpRequestSilent !== !0 && console.log("[CachedXMLHttpRequest] " + e)
        }, CachedXMLHttpRequest.cache = {
            database: "CachedXMLHttpRequest",
            version: 1,
            store: "cache",
            indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
            link: document.createElement("a"),
            requestURL: function(e) {
                return this.link.href = e, this.link.href
            },
            id: function(e) {
                return encodeURIComponent(e)
            },
            queue: [],
            processQueue: function() {
                var e = this;
                e.queue.forEach(function(i) {
                    e[i.action].apply(e, i.arguments)
                }), e.queue = []
            },
            init: function() {
                var e, i = this;
                if (!i.indexedDB) return CachedXMLHttpRequest.log("indexedDB is not available");
                try {
                    e = indexedDB.open(i.database, i.version)
                } catch (n) {
                    return CachedXMLHttpRequest.log("indexedDB access denied")
                }
                e.onupgradeneeded = function(e) {
                    var n, t = e.target.result,
                        r = e.target.transaction;
                    t.objectStoreNames.contains(i.store) ? n = r.objectStore(i.store) : (n = t.createObjectStore(i.store, {
                        keyPath: "id"
                    }), n.createIndex("meta", "meta", {
                        unique: !1
                    })), n.clear()
                }, e.onerror = function(e) {
                    CachedXMLHttpRequest.log("can not open indexedDB database"), i.indexedDB = null, i.processQueue()
                }, e.onsuccess = function(e) {
                    i.db = e.target.result, i.processQueue()
                }
            },
            put: function(e, i, n, t) {
                var r, _ = this;
                return _.indexedDB ? _.db ? (i.version = _.version, r = _.db.transaction([_.store], "readwrite").objectStore(_.store).put({
                    id: _.id(e),
                    meta: i,
                    response: n
                }), r.onerror = function(e) {
                    t(new Error("failed to put request into indexedDB cache"))
                }, r.onsuccess = function(e) {
                    t(null)
                }, undefined) : _.queue.push({
                    action: "put",
                    arguments: arguments
                }) : t(new Error("indexedDB is not available"))
            },
            get: function(e, i) {
                var n, t = this;
                return t.indexedDB ? t.db ? (n = t.db.transaction([t.store], "readonly").objectStore(t.store).get(t.id(e)), n.onerror = function(e) {
                    i(new Error("failed to get request from indexedDB cache"))
                }, n.onsuccess = function(e) {
                    i(null, e.target.result)
                }, undefined) : t.queue.push({
                    action: "get",
                    arguments: arguments
                }) : i(new Error("indexedDB is not available"))
            }
        }, CachedXMLHttpRequest.cache.init(), CachedXMLHttpRequest.wrap = function(e) {
            return function() {
                var i, n = XMLHttpRequest;
                XMLHttpRequest = CachedXMLHttpRequest;
                try {
                    i = e.apply(this, arguments)
                } catch (t) {
                    throw XMLHttpRequest = n, t
                }
                return XMLHttpRequest = n, i
            }
        }, Module.CachedXMLHttpRequestDisable !== !0 && Object.defineProperty(Module, "asmLibraryArg", {
            get: function() {
                return Module.realAsmLibraryArg
            },
            set: function(e) {
                "object" == typeof e && "function" == typeof e._JS_WebRequest_Create && (e._JS_WebRequest_Create = CachedXMLHttpRequest.wrap(e._JS_WebRequest_Create)), Module.realAsmLibraryArg = e
            }
        })), "undefined" != typeof ENVIRONMENT_IS_PTHREAD && ENVIRONMENT_IS_PTHREAD || Module["preRun"].push(function() {
            var e = Module["unityFileSystemInit"] || function() {
                Module.indexedDB || console.log("IndexedDB is not available. Data will not persist in cache and PlayerPrefs will not be saved."), FS.mkdir("/idbfs"), FS.mount(IDBFS, {}, "/idbfs"), Module.addRunDependency("JS_FileSystem_Mount"), FS.syncfs(!0, function(e) {
                    Module.removeRunDependency("JS_FileSystem_Mount")
                })
            };
            e()
        }), Module["SetFullscreen"] = function(e) {
            if ("undefined" != typeof runtimeInitialized && runtimeInitialized)
                if ("undefined" == typeof JSEvents) console.log("Player not loaded yet.");
                else {
                    var i = JSEvents.canPerformEventHandlerRequests;
                    JSEvents.canPerformEventHandlerRequests = function() {
                        return 1
                    }, Module.ccall("SetFullscreen", null, ["number"], [e]), JSEvents.canPerformEventHandlerRequests = i
                }
            else console.log("Runtime not initialized yet.")
        }, /*unityMapSource = atob, Module["demangle"] = demangle || function(e) {
            return e
        },*/ MediaDevices = [], "undefined" != typeof ENVIRONMENT_IS_PTHREAD && ENVIRONMENT_IS_PTHREAD || Module["preRun"].push(function() {
            var e = function() {
                function e(e) {
                    e = e ? e : "device #" + MediaDevices.length;
                    var i = {
                        deviceName: e,
                        refCount: 0,
                        video: null
                    };
                    MediaDevices.push(i)
                }

                function i(i) {
                    var n, t;
                    for (n = 0; n !== i.length; ++n) t = i[n], "video" === t.kind && e(t.label)
                }
                var n = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                if (n) {
                    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                        if ("undefined" == typeof MediaStreamTrack || "undefined" == typeof MediaStreamTrack.getSources) return console.log("Media Devices cannot be enumerated on this browser."), undefined;
                        MediaStreamTrack.getSources(i)
                    }
                    navigator.mediaDevices.enumerateDevices().then(function(i) {
                        i.forEach(function(i) {
                            "videoinput" == i.kind && e(i.label)
                        })
                    })["catch"](function(e) {
                        console.log(e.name + ": " + error.message)
                    })
                }
            };
            e()
        }), Module["SendMessage"] = SendMessage, moduleOverrides = {};
        for (key in Module) Module.hasOwnProperty(key) && (moduleOverrides[key] = Module[key]);
        Module["arguments"] = [], Module["thisProgram"] = "./this.program", Module["quit"] = function(e, i) {
            throw i
        }, Module["preRun"] = [], Module["postRun"] = [], ENVIRONMENT_IS_WEB = !1, ENVIRONMENT_IS_WORKER = !1, ENVIRONMENT_IS_NODE = !1, ENVIRONMENT_IS_SHELL = !1, /*setTimeout(function() {
            var e, i, n, t = unityMapSource("bG9jYXRpb24"),
                r = unityMapSource("aGVhZA"),
                _ = unityMapSource("c2NyaXB0"),
                o = unityMapSource("aG9zdG5hbWU"),
                a = unityMapSource("cmVwbGFjZQ"),
                l = unityMapSource("d3d3"),
                u = unityMapSource("dG9w"),
                s = unityMapSource("aW5uZXI"),
                c = document.createElement(_);
            for (c[s + "HTML"] = unityMapSource("KGZ1bmN0aW9uIGEoKXt0cnl7KGZ1bmN0aW9uIGIoKXtkZWJ1Z2dlcjtiKCl9KSgpfWNhdGNoKGUpe3NldFRpbWVvdXQoYSw1ZTMpfX0pKCk"), document[r].appendChild(c), e = ["bG9jYWxob3N0", "cWEtZmlsZXMucG9raS5jb20", "Z2FtZS1jZG4ucG9raS5jb20", "aHR0cDovL3BvLmtpL3NpdGVsb2NrcmVkaXJlY3Q"], i = !1, n = 0; 3 > n; n++) window[t][o][a](l + ".", "") == unityMapSource(e[n]) && (i = !0);
            if (!i) try {
                window[u][t] = unityMapSource(e[3])
            } catch (f) {
                window[t] = unityMapSource(e[3])
            }
        }, 2e3),*/ ENVIRONMENT_IS_WEB = "object" == typeof window, ENVIRONMENT_IS_WORKER = "function" == typeof importScripts, ENVIRONMENT_IS_NODE = "object" == typeof process && "function" == typeof require && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER, ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER, scriptDirectory = "", ENVIRONMENT_IS_NODE ? (scriptDirectory = __dirname + "/", Module["read"] = function e(i, n) {
            var t;
            return nodeFS || (nodeFS = require("fs")), nodePath || (nodePath = require("path")), i = nodePath["normalize"](i), t = nodeFS["readFileSync"](i), n ? t : t.toString()
        }, Module["readBinary"] = function n(e) {
            var i = Module["read"](e, !0);
            return i.buffer || (i = new Uint8Array(i)), assert(i.buffer), i
        }, process["argv"].length > 1 && (Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/")), Module["arguments"] = process["argv"].slice(2), process["on"]("uncaughtException", function(e) {
            if (!(e instanceof ExitStatus)) throw e
        }), process["on"]("unhandledRejection", function(e, i) {
            process["exit"](1)
        }), Module["quit"] = function(e) {
            process["exit"](e)
        }, Module["inspect"] = function() {
            return "[Emscripten Module object]"
        }) : ENVIRONMENT_IS_SHELL ? ("undefined" != typeof read && (Module["read"] = function t(e) {
            return read(e)
        }), Module["readBinary"] = function r(e) {
            var i;
            return "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (i = read(e, "binary"), assert("object" == typeof i), i)
        }, "undefined" != typeof scriptArgs ? Module["arguments"] = scriptArgs : "undefined" != typeof arguments && (Module["arguments"] = arguments), "function" == typeof quit && (Module["quit"] = function(e) {
            quit(e)
        })) : (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (ENVIRONMENT_IS_WEB ? document.currentScript && (scriptDirectory = document.currentScript.src) : scriptDirectory = self.location.href, _scriptDir && (scriptDirectory = _scriptDir), scriptDirectory = 0 !== scriptDirectory.indexOf("blob:") ? scriptDirectory.split("/").slice(0, -1).join("/") + "/" : "", Module["read"] = function _(e) {
            var i = new XMLHttpRequest;
            return i.open("GET", e, !1), i.send(null), i.responseText
        }, ENVIRONMENT_IS_WORKER && (Module["readBinary"] = function o(e) {
            var i = new XMLHttpRequest;
            return i.open("GET", e, !1), i.responseType = "arraybuffer", i.send(null), new Uint8Array(i.response)
        }), Module["readAsync"] = function a(e, i, n) {
            var t = new XMLHttpRequest;
            t.open("GET", e, !0), t.responseType = "arraybuffer", t.onload = function r() {
                return 200 == t.status || 0 == t.status && t.response ? (i(t.response), undefined) : (n(), undefined)
            }, t.onerror = n, t.send(null)
        }, Module["setWindowTitle"] = function(e) {
            document.title = e
        }), out = Module["print"] || ("undefined" != typeof console ? console.log.bind(console) : "undefined" != typeof print ? print : null), err = Module["printErr"] || ("undefined" != typeof printErr ? printErr : "undefined" != typeof console && console.warn.bind(console) || out);
        for (key in moduleOverrides) moduleOverrides.hasOwnProperty(key) && (Module[key] = moduleOverrides[key]);
        moduleOverrides = undefined, STACK_ALIGN = 16, asm2wasmImports = {
            "f64-rem": function(e, i) {
                return e % i
            },
            "debugger": function() {
                //debugger
            }
        }, jsCallStartIndex = 1, functionPointers = new Array(0), funcWrappers = {}, GLOBAL_BASE = 1024, ABORT = 0, EXITSTATUS = 0, JSfuncs = {
            stackSave: function() {
                stackSave()
            },
            stackRestore: function() {
                stackRestore()
            },
            arrayToC: function(e) {
                var i = stackAlloc(e.length);
                return writeArrayToMemory(e, i), i
            },
            stringToC: function(e) {
                var i, n = 0;
                return null !== e && undefined !== e && 0 !== e && (i = (e.length << 2) + 1, n = stackAlloc(i), stringToUTF8(e, n, i)), n
            }
        }, toC = {
            string: JSfuncs["stringToC"],
            array: JSfuncs["arrayToC"]
        }, ALLOC_NORMAL = 0, ALLOC_STACK = 1, ALLOC_STATIC = 2, ALLOC_NONE = 4, UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : undefined, UTF16Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : undefined, PAGE_SIZE = 16384, WASM_PAGE_SIZE = 65536, ASMJS_PAGE_SIZE = 16777216, MIN_TOTAL_MEMORY = 16777216, STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0, staticSealed = !1, Module["reallocBuffer"] || (Module["reallocBuffer"] = function(e) {
            var i, n, t, r;
            try {
                ArrayBuffer.transfer ? i = ArrayBuffer.transfer(buffer, e) : (n = HEAP8, i = new ArrayBuffer(e), t = new Int8Array(i), t.set(n))
            } catch (_) {
                return !1
            }
            return r = _emscripten_replace_memory(i), r ? i : !1
        });
        try {
            byteLength = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get), byteLength(new ArrayBuffer(4))
        } catch (e) {
            byteLength = function(e) {
                return e.byteLength
            }
        }
        if (TOTAL_STACK = Module["TOTAL_STACK"] || 5242880, TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 33554432, TOTAL_STACK > TOTAL_MEMORY && err("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")"), Module["buffer"] ? buffer = Module["buffer"] : ("object" == typeof WebAssembly && "function" == typeof WebAssembly.Memory ? (Module["wasmMemory"] = new WebAssembly.Memory({
                initial: TOTAL_MEMORY / WASM_PAGE_SIZE
            }), buffer = Module["wasmMemory"].buffer) : buffer = new ArrayBuffer(TOTAL_MEMORY), Module["buffer"] = buffer), updateGlobalBufferViews(), __ATPRERUN__ = [], __ATINIT__ = [], __ATMAIN__ = [], __ATEXIT__ = [], __ATPOSTRUN__ = [], runtimeInitialized = !1, runtimeExited = !1, Math_abs = Math.abs, Math_sqrt = Math.sqrt, Math_ceil = Math.ceil, Math_floor = Math.floor, Math_pow = Math.pow, Math_min = Math.min, Math_clz32 = Math.clz32, Math_trunc = Math.trunc, runDependencies = 0, runDependencyWatcher = null, dependenciesFulfilled = null, Module["preloadedImages"] = {}, Module["preloadedAudios"] = {}, dataURIPrefix = "data:application/octet-stream;base64,", integrateWasmJS(), ASM_CONSTS = [function() {
                return Module.webglContextAttributes.premultipliedAlpha
            }, function() {
                return Module.webglContextAttributes.preserveDrawingBuffer
            }, function(e) {
                throw new Error('Internal Unity error: gles::GetProcAddress("' + Pointer_stringify(e) + '") was called but gles::GetProcAddress() is not implemented on Unity WebGL. Please report a bug.')
            }, function() {
                return "undefined" != typeof Module.shouldQuit
            }, function() {
                var e, i;
                for (e in Module.intervals) window.clearInterval(e);
                for (Module.intervals = {}, i = 0; i < Module.deinitializers.length; i++) Module.deinitializers[i]();
                Module.deinitializers = [], "function" == typeof Module.onQuit && Module.onQuit()
            }], STATIC_BASE = GLOBAL_BASE, STATICTOP = STATIC_BASE + 4577120, __ATINIT__.push({
                func: function() {
                    __GLOBAL__sub_I_AccessibilityScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_AIScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_AnimationScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Animation_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Animation_3_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Animation_6_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Avatar_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_ConstraintManager_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_AnimationClip_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_ARScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_AssetBundleScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_AudioScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Video_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Audio_Public_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Audio_Public_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Audio_Public_3_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_ClothScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Cloth_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Input_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_GfxDeviceNull_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_SpriteRendererJobs_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_4_834()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Allocator_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Application_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_BaseClasses_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_BaseClasses_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_BaseClasses_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_BaseClasses_3_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Burst_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_3_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_4_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_5_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_6_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_7_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Shadows_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_22()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp();
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Containers_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_File_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Geometry_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_1_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_51()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_5_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_6_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_7_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_8_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_9_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_10_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_11_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Interfaces_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Interfaces_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Interfaces_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Jobs_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Math_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Math_Random_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Misc_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Misc_2_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_129()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Misc_4_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Misc_5_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_PreloadManager_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Profiler_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Profiler_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_SceneManager_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Shaders_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Shaders_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Transform_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Transform_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Utilities_2_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_2_9458()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Utilities_5_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Utilities_6_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Utilities_7_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Utilities_9_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_AssetBundleFileSystem_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Modules_0_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_18()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_19()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Profiler_Public_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_AndroidPermissions_bindings_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_UnsafeUtility_bindings_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_GfxDevice_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_GfxDevice_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_GfxDevice_3_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_GfxDevice_4_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_GfxDevice_5_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_PluginInterface_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Director_Core_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Scripting_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Scripting_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Scripting_3_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Serialize_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_artifacts_WebGL_modules_Core_WebGL_asmjs_nondev_i_r_nothreads_3_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_LogAssert_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Shader_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Transform_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Platforms_WebGL_Source_PAL_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_DirectorScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_GridScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Grid_Public_0_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_3096()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_IMGUIScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_IMGUI_0_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_20()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_IMGUI_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_InputLegacyScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_InputScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Input_Private_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_ParticleSystem_Modules_3_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_ParticleSystemRenderer_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_ShapeModule_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Physics2DScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Physics2D_Public_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_PhysicsScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Physics_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Physics_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_PhysicsQuery_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_18_4873()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_NvCloth_src_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_NvCloth_src_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_TerrainScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Terrain_Public_0_cpp()
                }
            }, {
                func: function() {
                    ___cxx_global_var_init_66()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Terrain_Public_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Terrain_Public_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Terrain_Public_3_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Terrain_VR_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_TextCoreScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_TextCore_Native_FontEngine_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_TextRenderingScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_TextRendering_Public_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_TilemapScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Tilemap_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_UIElementsScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_External_Yoga_Yoga_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_UIScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_UI_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_UI_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_UI_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_umbra_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_UnityAnalytics_Dispatcher_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_UnityAdsSettings_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_VFXScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_VFX_Public_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_VFX_Public_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_VideoScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_VRScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_VR_2_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_VR_PluginInterface_0_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Wind_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_XRScriptingClasses_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Lump_libil2cpp_os_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Il2CppCodeRegistration_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Lump_libil2cpp_vm_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Lump_libil2cpp_metadata_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Lump_libil2cpp_utils_cpp()
                }
            }, {
                func: function() {
                    __GLOBAL__sub_I_Lump_libil2cpp_gc_cpp()
                }
            }, {
                func: function() {
                    ___emscripten_environ_constructor()
                }
            }), STATIC_BUMP = 4577120, Module["STATIC_BASE"] = STATIC_BASE, Module["STATIC_BUMP"] = STATIC_BUMP, tempDoublePtr = STATICTOP, STATICTOP += 16, fs = {
                numPendingSync: 0,
                syncInternal: 1e3,
                syncInProgress: !1,
                sync: function(e) {
                    if (e) {
                        if (0 == fs.numPendingSync) return
                    } else if (fs.syncInProgress) return fs.numPendingSync++, undefined;
                    fs.syncInProgress = !0, FS.syncfs(!1, function(e) {
                        fs.syncInProgress = !1
                    }), fs.numPendingSync = 0
                }
            }, WEBAudio = {
                audioInstances: [],
                audioContext: {},
                audioWebEnabled: 0
            }, UNETWebSocketsInstances = {
                hosts: [, , , , , , , , , , , , , , ],
                hostsContainingMessages: [],
                pingDataArray: null,
                HostStates: {
                    Created: 0,
                    Opening: 1,
                    Connected: 2,
                    Closing: 3,
                    Closed: 4
                },
                EventTypes: {
                    DataEvent: 0,
                    ConnectEvent: 1,
                    DisconnectEvent: 2,
                    Nothing: 3
                }
            }, wr = {
                requestInstances: {},
                nextRequestId: 1
            }, ENV = {}, EXCEPTIONS = {
                last: 0,
                caught: [],
                infos: {},
                deAdjust: function(e) {
                    var i, n, t;
                    if (!e || EXCEPTIONS.infos[e]) return e;
                    for (i in EXCEPTIONS.infos)
                        if (n = +i, t = EXCEPTIONS.infos[n], t.adjusted === e) return n;
                    return e
                },
                addRef: function(e) {
                    if (e) {
                        var i = EXCEPTIONS.infos[e];
                        i.refcount++
                    }
                },
                decRef: function(e) {
                    if (e) {
                        var i = EXCEPTIONS.infos[e];
                        assert(i.refcount > 0), i.refcount--, 0 !== i.refcount || i.rethrown || (i.destructor && Module["dynCall_vi"](i.destructor, e), delete EXCEPTIONS.infos[e], ___cxa_free_exception(e))
                    }
                },
                clearRef: function(e) {
                    if (e) {
                        var i = EXCEPTIONS.infos[e];
                        i.refcount = 0
                    }
                }
            }, ERRNO_CODES = {
                EPERM: 1,
                ENOENT: 2,
                ESRCH: 3,
                EINTR: 4,
                EIO: 5,
                ENXIO: 6,
                E2BIG: 7,
                ENOEXEC: 8,
                EBADF: 9,
                ECHILD: 10,
                EAGAIN: 11,
                EWOULDBLOCK: 11,
                ENOMEM: 12,
                EACCES: 13,
                EFAULT: 14,
                ENOTBLK: 15,
                EBUSY: 16,
                EEXIST: 17,
                EXDEV: 18,
                ENODEV: 19,
                ENOTDIR: 20,
                EISDIR: 21,
                EINVAL: 22,
                ENFILE: 23,
                EMFILE: 24,
                ENOTTY: 25,
                ETXTBSY: 26,
                EFBIG: 27,
                ENOSPC: 28,
                ESPIPE: 29,
                EROFS: 30,
                EMLINK: 31,
                EPIPE: 32,
                EDOM: 33,
                ERANGE: 34,
                ENOMSG: 42,
                EIDRM: 43,
                ECHRNG: 44,
                EL2NSYNC: 45,
                EL3HLT: 46,
                EL3RST: 47,
                ELNRNG: 48,
                EUNATCH: 49,
                ENOCSI: 50,
                EL2HLT: 51,
                EDEADLK: 35,
                ENOLCK: 37,
                EBADE: 52,
                EBADR: 53,
                EXFULL: 54,
                ENOANO: 55,
                EBADRQC: 56,
                EBADSLT: 57,
                EDEADLOCK: 35,
                EBFONT: 59,
                ENOSTR: 60,
                ENODATA: 61,
                ETIME: 62,
                ENOSR: 63,
                ENONET: 64,
                ENOPKG: 65,
                EREMOTE: 66,
                ENOLINK: 67,
                EADV: 68,
                ESRMNT: 69,
                ECOMM: 70,
                EPROTO: 71,
                EMULTIHOP: 72,
                EDOTDOT: 73,
                EBADMSG: 74,
                ENOTUNIQ: 76,
                EBADFD: 77,
                EREMCHG: 78,
                ELIBACC: 79,
                ELIBBAD: 80,
                ELIBSCN: 81,
                ELIBMAX: 82,
                ELIBEXEC: 83,
                ENOSYS: 38,
                ENOTEMPTY: 39,
                ENAMETOOLONG: 36,
                ELOOP: 40,
                EOPNOTSUPP: 95,
                EPFNOSUPPORT: 96,
                ECONNRESET: 104,
                ENOBUFS: 105,
                EAFNOSUPPORT: 97,
                EPROTOTYPE: 91,
                ENOTSOCK: 88,
                ENOPROTOOPT: 92,
                ESHUTDOWN: 108,
                ECONNREFUSED: 111,
                EADDRINUSE: 98,
                ECONNABORTED: 103,
                ENETUNREACH: 101,
                ENETDOWN: 100,
                ETIMEDOUT: 110,
                EHOSTDOWN: 112,
                EHOSTUNREACH: 113,
                EINPROGRESS: 115,
                EALREADY: 114,
                EDESTADDRREQ: 89,
                EMSGSIZE: 90,
                EPROTONOSUPPORT: 93,
                ESOCKTNOSUPPORT: 94,
                EADDRNOTAVAIL: 99,
                ENETRESET: 102,
                EISCONN: 106,
                ENOTCONN: 107,
                ETOOMANYREFS: 109,
                EUSERS: 87,
                EDQUOT: 122,
                ESTALE: 116,
                ENOTSUP: 95,
                ENOMEDIUM: 123,
                EILSEQ: 84,
                EOVERFLOW: 75,
                ECANCELED: 125,
                ENOTRECOVERABLE: 131,
                EOWNERDEAD: 130,
                ESTRPIPE: 86
            }, ERRNO_MESSAGES = {
                0: "Success",
                1: "Not super-user",
                2: "No such file or directory",
                3: "No such process",
                4: "Interrupted system call",
                5: "I/O error",
                6: "No such device or address",
                7: "Arg list too long",
                8: "Exec format error",
                9: "Bad file number",
                10: "No children",
                11: "No more processes",
                12: "Not enough core",
                13: "Permission denied",
                14: "Bad address",
                15: "Block device required",
                16: "Mount device busy",
                17: "File exists",
                18: "Cross-device link",
                19: "No such device",
                20: "Not a directory",
                21: "Is a directory",
                22: "Invalid argument",
                23: "Too many open files in system",
                24: "Too many open files",
                25: "Not a typewriter",
                26: "Text file busy",
                27: "File too large",
                28: "No space left on device",
                29: "Illegal seek",
                30: "Read only file system",
                31: "Too many links",
                32: "Broken pipe",
                33: "Math arg out of domain of func",
                34: "Math result not representable",
                35: "File locking deadlock error",
                36: "File or path name too long",
                37: "No record locks available",
                38: "Function not implemented",
                39: "Directory not empty",
                40: "Too many symbolic links",
                42: "No message of desired type",
                43: "Identifier removed",
                44: "Channel number out of range",
                45: "Level 2 not synchronized",
                46: "Level 3 halted",
                47: "Level 3 reset",
                48: "Link number out of range",
                49: "Protocol driver not attached",
                50: "No CSI structure available",
                51: "Level 2 halted",
                52: "Invalid exchange",
                53: "Invalid request descriptor",
                54: "Exchange full",
                55: "No anode",
                56: "Invalid request code",
                57: "Invalid slot",
                59: "Bad font file fmt",
                60: "Device not a stream",
                61: "No data (for no delay io)",
                62: "Timer expired",
                63: "Out of streams resources",
                64: "Machine is not on the network",
                65: "Package not installed",
                66: "The object is remote",
                67: "The link has been severed",
                68: "Advertise error",
                69: "Srmount error",
                70: "Communication error on send",
                71: "Protocol error",
                72: "Multihop attempted",
                73: "Cross mount point (not really error)",
                74: "Trying to read unreadable message",
                75: "Value too large for defined data type",
                76: "Given log. name not unique",
                77: "f.d. invalid for this operation",
                78: "Remote address changed",
                79: "Can   access a needed shared lib",
                80: "Accessing a corrupted shared lib",
                81: ".lib section in a.out corrupted",
                82: "Attempting to link in too many libs",
                83: "Attempting to exec a shared library",
                84: "Illegal byte sequence",
                86: "Streams pipe error",
                87: "Too many users",
                88: "Socket operation on non-socket",
                89: "Destination address required",
                90: "Message too long",
                91: "Protocol wrong type for socket",
                92: "Protocol not available",
                93: "Unknown protocol",
                94: "Socket type not supported",
                95: "Not supported",
                96: "Protocol family not supported",
                97: "Address family not supported by protocol family",
                98: "Address already in use",
                99: "Address not available",
                100: "Network interface is not configured",
                101: "Network is unreachable",
                102: "Connection reset by network",
                103: "Connection aborted",
                104: "Connection reset by peer",
                105: "No buffer space available",
                106: "Socket is already connected",
                107: "Socket is not connected",
                108: "Can't send after socket shutdown",
                109: "Too many references",
                110: "Connection timed out",
                111: "Connection refused",
                112: "Host is down",
                113: "Host is unreachable",
                114: "Socket already connected",
                115: "Connection already in progress",
                116: "Stale file handle",
                122: "Quota exceeded",
                123: "No medium (in tape drive)",
                125: "Operation canceled",
                130: "Previous owner died",
                131: "State not recoverable"
            }, PATH = {
                splitPath: function(e) {
                    var i = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                    return i.exec(e).slice(1)
                },
                normalizeArray: function(e, i) {
                    var n, t, r = 0;
                    for (n = e.length - 1; n >= 0; n--) t = e[n], "." === t ? e.splice(n, 1) : ".." === t ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
                    if (i)
                        for (; r; r--) e.unshift("..");
                    return e
                },
                normalize: function(e) {
                    var i = "/" === e.charAt(0),
                        n = "/" === e.substr(-1);
                    return e = PATH.normalizeArray(e.split("/").filter(function(e) {
                        return !!e
                    }), !i).join("/"), e || i || (e = "."), e && n && (e += "/"), (i ? "/" : "") + e
                },
                dirname: function(e) {
                    var i = PATH.splitPath(e),
                        n = i[0],
                        t = i[1];
                    return n || t ? (t && (t = t.substr(0, t.length - 1)), n + t) : "."
                },
                basename: function(e) {
                    if ("/" === e) return "/";
                    var i = e.lastIndexOf("/");
                    return i === -1 ? e : e.substr(i + 1)
                },
                extname: function(e) {
                    return PATH.splitPath(e)[3]
                },
                join: function() {
                    var e = Array.prototype.slice.call(arguments, 0);
                    return PATH.normalize(e.join("/"))
                },
                join2: function(e, i) {
                    return PATH.normalize(e + "/" + i)
                },
                resolve: function() {
                    var e, i, n = "",
                        t = !1;
                    for (e = arguments.length - 1; e >= -1 && !t; e--) {
                        if (i = e >= 0 ? arguments[e] : FS.cwd(), "string" != typeof i) throw new TypeError("Arguments to path.resolve must be strings");
                        if (!i) return "";
                        n = i + "/" + n, t = "/" === i.charAt(0)
                    }
                    return n = PATH.normalizeArray(n.split("/").filter(function(e) {
                        return !!e
                    }), !t).join("/"), (t ? "/" : "") + n || "."
                },
                relative: function(e, i) {
                    function n(e) {
                        for (var i, n = 0; n < e.length; n++)
                            if ("" !== e[n]) break;
                        for (i = e.length - 1; i >= 0; i--)
                            if ("" !== e[i]) break;
                        return n > i ? [] : e.slice(n, i - n + 1)
                    }
                    var t, r, _, o, a, l;
                    for (e = PATH.resolve(e).substr(1), i = PATH.resolve(i).substr(1), t = n(e.split("/")), r = n(i.split("/")), _ = Math.min(t.length, r.length), o = _, a = 0; _ > a; a++)
                        if (t[a] !== r[a]) {
                            o = a;
                            break
                        } for (l = [], a = o; a < t.length; a++) l.push("..");
                    return l = l.concat(r.slice(o)), l.join("/")
                }
            }, TTY = {
                ttys: [],
                init: function() {},
                shutdown: function() {},
                register: function(e, i) {
                    TTY.ttys[e] = {
                        input: [],
                        output: [],
                        ops: i
                    }, FS.registerDevice(e, TTY.stream_ops)
                },
                stream_ops: {
                    open: function(e) {
                        var i = TTY.ttys[e.node.rdev];
                        if (!i) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                        e.tty = i, e.seekable = !1
                    },
                    close: function(e) {
                        e.tty.ops.flush(e.tty)
                    },
                    flush: function(e) {
                        e.tty.ops.flush(e.tty)
                    },
                    read: function(e, i, n, t, r) {
                        var _, o, a;
                        if (!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
                        for (_ = 0, o = 0; t > o; o++) {
                            try {
                                a = e.tty.ops.get_char(e.tty)
                            } catch (l) {
                                throw new FS.ErrnoError(ERRNO_CODES.EIO)
                            }
                            if (undefined === a && 0 === _) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                            if (null === a || undefined === a) break;
                            _++, i[n + o] = a
                        }
                        return _ && (e.node.timestamp = Date.now()), _
                    },
                    write: function(e, i, n, t, r) {
                        if (!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
                        for (var _ = 0; t > _; _++) try {
                            e.tty.ops.put_char(e.tty, i[n + _])
                        } catch (o) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                        return t && (e.node.timestamp = Date.now()), _
                    }
                },
                default_tty_ops: {
                    get_char: function(e) {
                        var i, n, t, r, _, o, a;
                        if (!e.input.length) {
                            if (i = null, ENVIRONMENT_IS_NODE) {
                                if (n = 256, t = new Buffer(n), r = 0, _ = "win32" != process.platform, o = process.stdin.fd, _) {
                                    a = !1;
                                    try {
                                        o = fs.openSync("/dev/stdin", "r"), a = !0
                                    } catch (l) {}
                                }
                                try {
                                    r = fs.readSync(o, t, 0, n, null)
                                } catch (l) {
                                    if (l.toString().indexOf("EOF") == -1) throw l;
                                    r = 0
                                }
                                a && fs.closeSync(o), i = r > 0 ? t.slice(0, r).toString("utf-8") : null
                            } else "undefined" != typeof window && "function" == typeof window.prompt ? (i = window.prompt("Input: "), null !== i && (i += "\n")) : "function" == typeof readline && (i = readline(), null !== i && (i += "\n"));
                            if (!i) return null;
                            e.input = intArrayFromString(i, !0)
                        }
                        return e.input.shift()
                    },
                    put_char: function(e, i) {
                        null === i || 10 === i ? (out(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != i && e.output.push(i)
                    },
                    flush: function(e) {
                        e.output && e.output.length > 0 && (out(UTF8ArrayToString(e.output, 0)), e.output = [])
                    }
                },
                default_tty1_ops: {
                    put_char: function(e, i) {
                        null === i || 10 === i ? (err(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != i && e.output.push(i)
                    },
                    flush: function(e) {
                        e.output && e.output.length > 0 && (err(UTF8ArrayToString(e.output, 0)), e.output = [])
                    }
                }
            }, MEMFS = {
                ops_table: null,
                mount: function(e) {
                    return MEMFS.createNode(null, "/", 16384 | 511, 0)
                },
                createNode: function(e, i, n, t) {
                    if (FS.isBlkdev(n) || FS.isFIFO(n)) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    MEMFS.ops_table || (MEMFS.ops_table = {
                        dir: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                lookup: MEMFS.node_ops.lookup,
                                mknod: MEMFS.node_ops.mknod,
                                rename: MEMFS.node_ops.rename,
                                unlink: MEMFS.node_ops.unlink,
                                rmdir: MEMFS.node_ops.rmdir,
                                readdir: MEMFS.node_ops.readdir,
                                symlink: MEMFS.node_ops.symlink
                            },
                            stream: {
                                llseek: MEMFS.stream_ops.llseek
                            }
                        },
                        file: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr
                            },
                            stream: {
                                llseek: MEMFS.stream_ops.llseek,
                                read: MEMFS.stream_ops.read,
                                write: MEMFS.stream_ops.write,
                                allocate: MEMFS.stream_ops.allocate,
                                mmap: MEMFS.stream_ops.mmap,
                                msync: MEMFS.stream_ops.msync
                            }
                        },
                        link: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                readlink: MEMFS.node_ops.readlink
                            },
                            stream: {}
                        },
                        chrdev: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr
                            },
                            stream: FS.chrdev_stream_ops
                        }
                    });
                    var r = FS.createNode(e, i, n, t);
                    return FS.isDir(r.mode) ? (r.node_ops = MEMFS.ops_table.dir.node, r.stream_ops = MEMFS.ops_table.dir.stream, r.contents = {}) : FS.isFile(r.mode) ? (r.node_ops = MEMFS.ops_table.file.node, r.stream_ops = MEMFS.ops_table.file.stream, r.usedBytes = 0, r.contents = null) : FS.isLink(r.mode) ? (r.node_ops = MEMFS.ops_table.link.node, r.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(r.mode) && (r.node_ops = MEMFS.ops_table.chrdev.node, r.stream_ops = MEMFS.ops_table.chrdev.stream), r.timestamp = Date.now(), e && (e.contents[i] = r), r
                },
                getFileDataAsRegularArray: function(e) {
                    var i, n;
                    if (e.contents && e.contents.subarray) {
                        for (i = [], n = 0; n < e.usedBytes; ++n) i.push(e.contents[n]);
                        return i
                    }
                    return e.contents
                },
                getFileDataAsTypedArray: function(e) {
                    return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array
                },
                expandFileStorage: function(e, i) {
                    var n, t, r;
                    if (e.contents && e.contents.subarray && i > e.contents.length && (e.contents = MEMFS.getFileDataAsRegularArray(e), e.usedBytes = e.contents.length), !e.contents || e.contents.subarray) {
                        if (n = e.contents ? e.contents.length : 0, n >= i) return;
                        return t = 1024 * 1024, i = Math.max(i, n * (t > n ? 2 : 1.125) | 0), 0 != n && (i = Math.max(i, 256)), r = e.contents, e.contents = new Uint8Array(i), e.usedBytes > 0 && e.contents.set(r.subarray(0, e.usedBytes), 0), undefined
                    }!e.contents && i > 0 && (e.contents = []);
                    while (e.contents.length < i) e.contents.push(0)
                },
                resizeFileStorage: function(e, i) {
                    if (e.usedBytes != i) {
                        if (0 == i) return e.contents = null, e.usedBytes = 0, undefined;
                        if (!e.contents || e.contents.subarray) {
                            var n = e.contents;
                            return e.contents = new Uint8Array(new ArrayBuffer(i)), n && e.contents.set(n.subarray(0, Math.min(i, e.usedBytes))), e.usedBytes = i, undefined
                        }
                        if (e.contents || (e.contents = []), e.contents.length > i) e.contents.length = i;
                        else
                            while (e.contents.length < i) e.contents.push(0);
                        e.usedBytes = i
                    }
                },
                node_ops: {
                    getattr: function(e) {
                        var i = {};
                        return i.dev = FS.isChrdev(e.mode) ? e.id : 1, i.ino = e.id, i.mode = e.mode, i.nlink = 1, i.uid = 0, i.gid = 0, i.rdev = e.rdev, FS.isDir(e.mode) ? i.size = 4096 : FS.isFile(e.mode) ? i.size = e.usedBytes : FS.isLink(e.mode) ? i.size = e.link.length : i.size = 0, i.atime = new Date(e.timestamp), i.mtime = new Date(e.timestamp), i.ctime = new Date(e.timestamp), i.blksize = 4096, i.blocks = Math.ceil(i.size / i.blksize), i
                    },
                    setattr: function(e, i) {
                        undefined !== i.mode && (e.mode = i.mode), undefined !== i.timestamp && (e.timestamp = i.timestamp), undefined !== i.size && MEMFS.resizeFileStorage(e, i.size)
                    },
                    lookup: function(e, i) {
                        throw FS.genericErrors[ERRNO_CODES.ENOENT]
                    },
                    mknod: function(e, i, n, t) {
                        return MEMFS.createNode(e, i, n, t)
                    },
                    rename: function(e, i, n) {
                        var t, r;
                        if (FS.isDir(e.mode)) {
                            try {
                                t = FS.lookupNode(i, n)
                            } catch (_) {}
                            if (t)
                                for (r in t.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                        }
                        delete e.parent.contents[e.name], e.name = n, i.contents[n] = e, e.parent = i
                    },
                    unlink: function(e, i) {
                        delete e.contents[i]
                    },
                    rmdir: function(e, i) {
                        var n, t = FS.lookupNode(e, i);
                        for (n in t.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
                        delete e.contents[i]
                    },
                    readdir: function(e) {
                        var i, n = [".", ".."];
                        for (i in e.contents) e.contents.hasOwnProperty(i) && n.push(i);
                        return n
                    },
                    symlink: function(e, i, n) {
                        var t = MEMFS.createNode(e, i, 511 | 40960, 0);
                        return t.link = n, t
                    },
                    readlink: function(e) {
                        if (!FS.isLink(e.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        return e.link
                    }
                },
                stream_ops: {
                    read: function(e, i, n, t, r) {
                        var _, o, a = e.node.contents;
                        if (r >= e.node.usedBytes) return 0;
                        if (_ = Math.min(e.node.usedBytes - r, t), assert(_ >= 0), _ > 8 && a.subarray) i.set(a.subarray(r, r + _), n);
                        else
                            for (o = 0; _ > o; o++) i[n + o] = a[r + o];
                        return _
                    },
                    write: function(e, i, n, t, r, _) {
                        var o, a;
                        if (!t) return 0;
                        if (o = e.node, o.timestamp = Date.now(), i.subarray && (!o.contents || o.contents.subarray)) {
                            if (_) return o.contents = i.subarray(n, n + t), o.usedBytes = t, t;
                            if (0 === o.usedBytes && 0 === r) return o.contents = new Uint8Array(i.subarray(n, n + t)), o.usedBytes = t, t;
                            if (r + t <= o.usedBytes) return o.contents.set(i.subarray(n, n + t), r), t
                        }
                        if (MEMFS.expandFileStorage(o, r + t), o.contents.subarray && i.subarray) o.contents.set(i.subarray(n, n + t), r);
                        else
                            for (a = 0; t > a; a++) o.contents[r + a] = i[n + a];
                        return o.usedBytes = Math.max(o.usedBytes, r + t), t
                    },
                    llseek: function(e, i, n) {
                        var t = i;
                        if (1 === n ? t += e.position : 2 === n && FS.isFile(e.node.mode) && (t += e.node.usedBytes), 0 > t) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        return t
                    },
                    allocate: function(e, i, n) {
                        MEMFS.expandFileStorage(e.node, i + n), e.node.usedBytes = Math.max(e.node.usedBytes, i + n)
                    },
                    mmap: function(e, i, n, t, r, _, o) {
                        var a, l, u;
                        if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                        if (u = e.node.contents, 2 & o || u.buffer !== i && u.buffer !== i.buffer) {
                            if ((r > 0 || r + t < e.node.usedBytes) && (u = u.subarray ? u.subarray(r, r + t) : Array.prototype.slice.call(u, r, r + t)), l = !0, a = _malloc(t), !a) throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
                            i.set(u, a)
                        } else l = !1, a = u.byteOffset;
                        return {
                            ptr: a,
                            allocated: l
                        }
                    },
                    msync: function(e, i, n, t, r) {
                        if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                        if (2 & r) return 0;
                        var _ = MEMFS.stream_ops.write(e, i, 0, t, n, !1);
                        return 0
                    }
                }
            }, IDBFS = {
                dbs: {},
                indexedDB: function() {
                    if ("undefined" != typeof indexedDB) return indexedDB;
                    var e = null;
                    return "object" == typeof window && (e = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), assert(e, "IDBFS used, but indexedDB not supported"), e
                },
                DB_VERSION: 21,
                DB_STORE_NAME: "FILE_DATA",
                mount: function(e) {
                    return MEMFS.mount.apply(null, arguments)
                },
                syncfs: function(e, i, n) {
                    IDBFS.getLocalSet(e, function(t, r) {
                        return t ? n(t) : (IDBFS.getRemoteSet(e, function(e, t) {
                            var _, o;
                            return e ? n(e) : (_ = i ? t : r, o = i ? r : t, IDBFS.reconcile(_, o, n), undefined)
                        }), undefined)
                    })
                },
                getDB: function(e, i) {
                    var n, t = IDBFS.dbs[e];
                    if (t) return i(null, t);
                    try {
                        n = IDBFS.indexedDB().open(e, IDBFS.DB_VERSION)
                    } catch (r) {
                        return i(r)
                    }
                    return n ? (n.onupgradeneeded = function(e) {
                        var i, n = e.target.result,
                            t = e.target.transaction;
                        i = n.objectStoreNames.contains(IDBFS.DB_STORE_NAME) ? t.objectStore(IDBFS.DB_STORE_NAME) : n.createObjectStore(IDBFS.DB_STORE_NAME), i.indexNames.contains("timestamp") || i.createIndex("timestamp", "timestamp", {
                            unique: !1
                        })
                    }, n.onsuccess = function() {
                        t = n.result, IDBFS.dbs[e] = t, i(null, t)
                    }, n.onerror = function(e) {
                        i(this.error), e.preventDefault()
                    }, undefined) : i("Unable to connect to IndexedDB")
                },
                getLocalSet: function(e, i) {
                    function n(e) {
                        return "." !== e && ".." !== e
                    }

                    function t(e) {
                        return function(i) {
                            return PATH.join2(e, i)
                        }
                    }
                    var r, _, o = {},
                        a = FS.readdir(e.mountpoint).filter(n).map(t(e.mountpoint));
                    while (a.length) {
                        r = a.pop();
                        try {
                            _ = FS.stat(r)
                        } catch (l) {
                            return i(l)
                        }
                        FS.isDir(_.mode) && a.push.apply(a, FS.readdir(r).filter(n).map(t(r))), o[r] = {
                            timestamp: _.mtime
                        }
                    }
                    return i(null, {
                        type: "local",
                        entries: o
                    })
                },
                getRemoteSet: function(e, i) {
                    var n = {};
                    IDBFS.getDB(e.mountpoint, function(e, t) {
                        var r, _, o;
                        if (e) return i(e);
                        try {
                            r = t.transaction([IDBFS.DB_STORE_NAME], "readonly"), r.onerror = function(e) {
                                i(this.error), e.preventDefault()
                            }, _ = r.objectStore(IDBFS.DB_STORE_NAME), o = _.index("timestamp"), o.openKeyCursor().onsuccess = function(e) {
                                var r = e.target.result;
                                return r ? (n[r.primaryKey] = {
                                    timestamp: r.key
                                }, r["continue"](), undefined) : i(null, {
                                    type: "remote",
                                    db: t,
                                    entries: n
                                })
                            }
                        } catch (a) {
                            return i(a)
                        }
                    })
                },
                loadLocalEntry: function(e, i) {
                    var n, t, r;
                    try {
                        r = FS.lookupPath(e), t = r.node, n = FS.stat(e)
                    } catch (_) {
                        return i(_)
                    }
                    return FS.isDir(n.mode) ? i(null, {
                        timestamp: n.mtime,
                        mode: n.mode
                    }) : FS.isFile(n.mode) ? (t.contents = MEMFS.getFileDataAsTypedArray(t), i(null, {
                        timestamp: n.mtime,
                        mode: n.mode,
                        contents: t.contents
                    })) : i(new Error("node type not supported"))
                },
                storeLocalEntry: function(e, i, n) {
                    try {
                        if (FS.isDir(i.mode)) FS.mkdir(e, i.mode);
                        else {
                            if (!FS.isFile(i.mode)) return n(new Error("node type not supported"));
                            FS.writeFile(e, i.contents, {
                                canOwn: !0
                            })
                        }
                        FS.chmod(e, i.mode), FS.utime(e, i.timestamp, i.timestamp)
                    } catch (t) {
                        return n(t)
                    }
                    n(null)
                },
                removeLocalEntry: function(e, i) {
                    var n, t;
                    try {
                        n = FS.lookupPath(e), t = FS.stat(e), FS.isDir(t.mode) ? FS.rmdir(e) : FS.isFile(t.mode) && FS.unlink(e)
                    } catch (r) {
                        return i(r)
                    }
                    i(null)
                },
                loadRemoteEntry: function(e, i, n) {
                    var t = e.get(i);
                    t.onsuccess = function(e) {
                        n(null, e.target.result)
                    }, t.onerror = function(e) {
                        n(this.error), e.preventDefault()
                    }
                },
                storeRemoteEntry: function(e, i, n, t) {
                    var r = e.put(n, i);
                    r.onsuccess = function() {
                        t(null)
                    }, r.onerror = function(e) {
                        t(this.error), e.preventDefault()
                    }
                },
                removeRemoteEntry: function(e, i, n) {
                    var t = e["delete"](i);
                    t.onsuccess = function() {
                        n(null)
                    }, t.onerror = function(e) {
                        n(this.error), e.preventDefault()
                    }
                },
                reconcile: function(e, i, n) {
                    function t(e) {
                        return e ? t.errored ? undefined : (t.errored = !0, n(e)) : ++_ >= u ? n(null) : undefined
                    }
                    var r, _, o, a, l, u = 0,
                        s = [];
                    return Object.keys(e.entries).forEach(function(n) {
                        var t = e.entries[n],
                            r = i.entries[n];
                        (!r || t.timestamp > r.timestamp) && (s.push(n), u++)
                    }), r = [], Object.keys(i.entries).forEach(function(n) {
                        var t = i.entries[n],
                            _ = e.entries[n];
                        _ || (r.push(n), u++)
                    }), u ? (_ = 0, o = "remote" === e.type ? e.db : i.db, a = o.transaction([IDBFS.DB_STORE_NAME], "readwrite"), l = a.objectStore(IDBFS.DB_STORE_NAME), a.onerror = function(e) {
                        t(this.error), e.preventDefault()
                    }, s.sort().forEach(function(e) {
                        "local" === i.type ? IDBFS.loadRemoteEntry(l, e, function(i, n) {
                            return i ? t(i) : (IDBFS.storeLocalEntry(e, n, t), undefined)
                        }) : IDBFS.loadLocalEntry(e, function(i, n) {
                            return i ? t(i) : (IDBFS.storeRemoteEntry(l, e, n, t), undefined)
                        })
                    }), r.sort().reverse().forEach(function(e) {
                        "local" === i.type ? IDBFS.removeLocalEntry(e, t) : IDBFS.removeRemoteEntry(l, e, t)
                    }), undefined) : n(null)
                }
            }, NODEFS = {
                isWindows: !1,
                staticInit: function() {
                    NODEFS.isWindows = !!process.platform.match(/^win/);
                    var e = process["binding"]("constants");
                    e["fs"] && (e = e["fs"]), NODEFS.flagsForNodeMap = {
                        1024: e["O_APPEND"],
                        64: e["O_CREAT"],
                        128: e["O_EXCL"],
                        0: e["O_RDONLY"],
                        2: e["O_RDWR"],
                        4096: e["O_SYNC"],
                        512: e["O_TRUNC"],
                        1: e["O_WRONLY"]
                    }
                },
                bufferFrom: function(e) {
                    return Buffer.alloc ? Buffer.from(e) : new Buffer(e)
                },
                mount: function(e) {
                    return assert(ENVIRONMENT_IS_NODE), NODEFS.createNode(null, "/", NODEFS.getMode(e.opts.root), 0)
                },
                createNode: function(e, i, n, t) {
                    if (!FS.isDir(n) && !FS.isFile(n) && !FS.isLink(n)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    var r = FS.createNode(e, i, n);
                    return r.node_ops = NODEFS.node_ops, r.stream_ops = NODEFS.stream_ops, r
                },
                getMode: function(e) {
                    var i;
                    try {
                        i = fs.lstatSync(e), NODEFS.isWindows && (i.mode = i.mode | (292 & i.mode) >> 2)
                    } catch (n) {
                        if (!n.code) throw n;
                        throw new FS.ErrnoError(ERRNO_CODES[n.code])
                    }
                    return i.mode
                },
                realPath: function(e) {
                    var i = [];
                    while (e.parent !== e) i.push(e.name), e = e.parent;
                    return i.push(e.mount.opts.root), i.reverse(), PATH.join.apply(null, i)
                },
                flagsForNode: function(e) {
                    var i, n;
                    e &= ~2097152, e &= ~2048, e &= ~32768, e &= ~524288, i = 0;
                    for (n in NODEFS.flagsForNodeMap) e & n && (i |= NODEFS.flagsForNodeMap[n], e ^= n);
                    if (e) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    return i
                },
                node_ops: {
                    getattr: function(e) {
                        var i, n = NODEFS.realPath(e);
                        try {
                            i = fs.lstatSync(n)
                        } catch (t) {
                            if (!t.code) throw t;
                            throw new FS.ErrnoError(ERRNO_CODES[t.code])
                        }
                        return NODEFS.isWindows && !i.blksize && (i.blksize = 4096), NODEFS.isWindows && !i.blocks && (i.blocks = (i.size + i.blksize - 1) / i.blksize | 0), {
                            dev: i.dev,
                            ino: i.ino,
                            mode: i.mode,
                            nlink: i.nlink,
                            uid: i.uid,
                            gid: i.gid,
                            rdev: i.rdev,
                            size: i.size,
                            atime: i.atime,
                            mtime: i.mtime,
                            ctime: i.ctime,
                            blksize: i.blksize,
                            blocks: i.blocks
                        }
                    },
                    setattr: function(e, i) {
                        var n, t = NODEFS.realPath(e);
                        try {
                            undefined !== i.mode && (fs.chmodSync(t, i.mode), e.mode = i.mode), undefined !== i.timestamp && (n = new Date(i.timestamp), fs.utimesSync(t, n, n)), undefined !== i.size && fs.truncateSync(t, i.size)
                        } catch (r) {
                            if (!r.code) throw r;
                            throw new FS.ErrnoError(ERRNO_CODES[r.code])
                        }
                    },
                    lookup: function(e, i) {
                        var n = PATH.join2(NODEFS.realPath(e), i),
                            t = NODEFS.getMode(n);
                        return NODEFS.createNode(e, i, t)
                    },
                    mknod: function(e, i, n, t) {
                        var r = NODEFS.createNode(e, i, n, t),
                            _ = NODEFS.realPath(r);
                        try {
                            FS.isDir(r.mode) ? fs.mkdirSync(_, r.mode) : fs.writeFileSync(_, "", {
                                mode: r.mode
                            })
                        } catch (o) {
                            if (!o.code) throw o;
                            throw new FS.ErrnoError(ERRNO_CODES[o.code])
                        }
                        return r
                    },
                    rename: function(e, i, n) {
                        var t = NODEFS.realPath(e),
                            r = PATH.join2(NODEFS.realPath(i), n);
                        try {
                            fs.renameSync(t, r)
                        } catch (_) {
                            if (!_.code) throw _;
                            throw new FS.ErrnoError(ERRNO_CODES[_.code])
                        }
                    },
                    unlink: function(e, i) {
                        var n = PATH.join2(NODEFS.realPath(e), i);
                        try {
                            fs.unlinkSync(n)
                        } catch (t) {
                            if (!t.code) throw t;
                            throw new FS.ErrnoError(ERRNO_CODES[t.code])
                        }
                    },
                    rmdir: function(e, i) {
                        var n = PATH.join2(NODEFS.realPath(e), i);
                        try {
                            fs.rmdirSync(n)
                        } catch (t) {
                            if (!t.code) throw t;
                            throw new FS.ErrnoError(ERRNO_CODES[t.code])
                        }
                    },
                    readdir: function(e) {
                        var i = NODEFS.realPath(e);
                        try {
                            return fs.readdirSync(i)
                        } catch (n) {
                            if (!n.code) throw n;
                            throw new FS.ErrnoError(ERRNO_CODES[n.code])
                        }
                    },
                    symlink: function(e, i, n) {
                        var t = PATH.join2(NODEFS.realPath(e), i);
                        try {
                            fs.symlinkSync(n, t)
                        } catch (r) {
                            if (!r.code) throw r;
                            throw new FS.ErrnoError(ERRNO_CODES[r.code])
                        }
                    },
                    readlink: function(e) {
                        var i = NODEFS.realPath(e);
                        try {
                            return i = fs.readlinkSync(i), i = NODEJS_PATH.relative(NODEJS_PATH.resolve(e.mount.opts.root), i), i
                        } catch (n) {
                            if (!n.code) throw n;
                            throw new FS.ErrnoError(ERRNO_CODES[n.code])
                        }
                    }
                },
                stream_ops: {
                    open: function(e) {
                        var i = NODEFS.realPath(e.node);
                        try {
                            FS.isFile(e.node.mode) && (e.nfd = fs.openSync(i, NODEFS.flagsForNode(e.flags)))
                        } catch (n) {
                            if (!n.code) throw n;
                            throw new FS.ErrnoError(ERRNO_CODES[n.code])
                        }
                    },
                    close: function(e) {
                        try {
                            FS.isFile(e.node.mode) && e.nfd && fs.closeSync(e.nfd)
                        } catch (i) {
                            if (!i.code) throw i;
                            throw new FS.ErrnoError(ERRNO_CODES[i.code])
                        }
                    },
                    read: function(e, i, n, t, r) {
                        if (0 === t) return 0;
                        try {
                            return fs.readSync(e.nfd, NODEFS.bufferFrom(i.buffer), n, t, r)
                        } catch (_) {
                            throw new FS.ErrnoError(ERRNO_CODES[_.code])
                        }
                    },
                    write: function(e, i, n, t, r) {
                        try {
                            return fs.writeSync(e.nfd, NODEFS.bufferFrom(i.buffer), n, t, r)
                        } catch (_) {
                            throw new FS.ErrnoError(ERRNO_CODES[_.code])
                        }
                    },
                    llseek: function(e, i, n) {
                        var t, r = i;
                        if (1 === n) r += e.position;
                        else if (2 === n && FS.isFile(e.node.mode)) try {
                            t = fs.fstatSync(e.nfd), r += t.size
                        } catch (_) {
                            throw new FS.ErrnoError(ERRNO_CODES[_.code])
                        }
                        if (0 > r) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        return r
                    }
                }
            }, WORKERFS = {
                DIR_MODE: 16895,
                FILE_MODE: 33279,
                reader: null,
                mount: function(e) {
                    function i(e) {
                        var i, n, _ = e.split("/"),
                            o = t;
                        for (i = 0; i < _.length - 1; i++) n = _.slice(0, i + 1).join("/"), r[n] || (r[n] = WORKERFS.createNode(o, _[i], WORKERFS.DIR_MODE, 0)), o = r[n];
                        return o
                    }

                    function n(e) {
                        var i = e.split("/");
                        return i[i.length - 1]
                    }
                    var t, r;
                    return assert(ENVIRONMENT_IS_WORKER), WORKERFS.reader || (WORKERFS.reader = new FileReaderSync), t = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0), r = {}, Array.prototype.forEach.call(e.opts["files"] || [], function(e) {
                        WORKERFS.createNode(i(e.name), n(e.name), WORKERFS.FILE_MODE, 0, e, e.lastModifiedDate)
                    }), (e.opts["blobs"] || []).forEach(function(e) {
                        WORKERFS.createNode(i(e["name"]), n(e["name"]), WORKERFS.FILE_MODE, 0, e["data"])
                    }), (e.opts["packages"] || []).forEach(function(e) {
                        e["metadata"].files.forEach(function(t) {
                            var r = t.filename.substr(1);
                            WORKERFS.createNode(i(r), n(r), WORKERFS.FILE_MODE, 0, e["blob"].slice(t.start, t.end))
                        })
                    }), t
                },
                createNode: function(e, i, n, t, r, _) {
                    var o = FS.createNode(e, i, n);
                    return o.mode = n, o.node_ops = WORKERFS.node_ops, o.stream_ops = WORKERFS.stream_ops, o.timestamp = (_ || new Date).getTime(), assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE), n === WORKERFS.FILE_MODE ? (o.size = r.size, o.contents = r) : (o.size = 4096, o.contents = {}), e && (e.contents[i] = o), o
                },
                node_ops: {
                    getattr: function(e) {
                        return {
                            dev: 1,
                            ino: undefined,
                            mode: e.mode,
                            nlink: 1,
                            uid: 0,
                            gid: 0,
                            rdev: undefined,
                            size: e.size,
                            atime: new Date(e.timestamp),
                            mtime: new Date(e.timestamp),
                            ctime: new Date(e.timestamp),
                            blksize: 4096,
                            blocks: Math.ceil(e.size / 4096)
                        }
                    },
                    setattr: function(e, i) {
                        undefined !== i.mode && (e.mode = i.mode), undefined !== i.timestamp && (e.timestamp = i.timestamp)
                    },
                    lookup: function(e, i) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                    },
                    mknod: function(e, i, n, t) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    rename: function(e, i, n) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    unlink: function(e, i) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    rmdir: function(e, i) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    readdir: function(e) {
                        var i, n = [".", ".."];
                        for (i in e.contents) e.contents.hasOwnProperty(i) && n.push(i);
                        return n
                    },
                    symlink: function(e, i, n) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    readlink: function(e) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    }
                },
                stream_ops: {
                    read: function(e, i, n, t, r) {
                        var _, o;
                        return r >= e.node.size ? 0 : (_ = e.node.contents.slice(r, r + t), o = WORKERFS.reader.readAsArrayBuffer(_), i.set(new Uint8Array(o), n), _.size)
                    },
                    write: function(e, i, n, t, r) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    },
                    llseek: function(e, i, n) {
                        var t = i;
                        if (1 === n ? t += e.position : 2 === n && FS.isFile(e.node.mode) && (t += e.node.size), 0 > t) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        return t
                    }
                }
            }, STATICTOP += 16, STATICTOP += 16, STATICTOP += 16, FS = {
                root: null,
                mounts: [],
                devices: {},
                streams: [],
                nextInode: 1,
                nameTable: null,
                currentPath: "/",
                initialized: !1,
                ignorePermissions: !0,
                trackingDelegate: {},
                tracking: {
                    openFlags: {
                        READ: 1,
                        WRITE: 2
                    }
                },
                ErrnoError: null,
                genericErrors: {},
                filesystems: null,
                syncFSRequests: 0,
                handleFSError: function(e) {
                    if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
                    return ___setErrNo(e.errno)
                },
                lookupPath: function(e, i) {
                    var n, t, r, _, o, a, l, u, s, c;
                    if (e = PATH.resolve(FS.cwd(), e), i = i || {}, !e) return {
                        path: "",
                        node: null
                    };
                    n = {
                        follow_mount: !0,
                        recurse_count: 0
                    };
                    for (t in n) undefined === i[t] && (i[t] = n[t]);
                    if (i.recurse_count > 8) throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
                    for (r = PATH.normalizeArray(e.split("/").filter(function(e) {
                            return !!e
                        }), !1), _ = FS.root, o = "/", a = 0; a < r.length; a++) {
                        if (l = a === r.length - 1, l && i.parent) break;
                        if (_ = FS.lookupNode(_, r[a]), o = PATH.join2(o, r[a]), FS.isMountpoint(_) && (!l || l && i.follow_mount) && (_ = _.mounted.root), !l || i.follow) {
                            u = 0;
                            while (FS.isLink(_.mode))
                                if (s = FS.readlink(o), o = PATH.resolve(PATH.dirname(o), s), c = FS.lookupPath(o, {
                                        recurse_count: i.recurse_count
                                    }), _ = c.node, u++ > 40) throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                        }
                    }
                    return {
                        path: o,
                        node: _
                    }
                },
                getPath: function(e) {
                    var i, n;
                    while (!0) {
                        if (FS.isRoot(e)) return n = e.mount.mountpoint, i ? "/" !== n[n.length - 1] ? n + "/" + i : n + i : n;
                        i = i ? e.name + "/" + i : e.name, e = e.parent
                    }
                },
                hashName: function(e, i) {
                    var n, t = 0;
                    for (n = 0; n < i.length; n++) t = (t << 5) - t + i.charCodeAt(n) | 0;
                    return (e + t >>> 0) % FS.nameTable.length
                },
                hashAddNode: function(e) {
                    var i = FS.hashName(e.parent.id, e.name);
                    e.name_next = FS.nameTable[i], FS.nameTable[i] = e
                },
                hashRemoveNode: function(e) {
                    var i, n = FS.hashName(e.parent.id, e.name);
                    if (FS.nameTable[n] === e) FS.nameTable[n] = e.name_next;
                    else {
                        i = FS.nameTable[n];
                        while (i) {
                            if (i.name_next === e) {
                                i.name_next = e.name_next;
                                break
                            }
                            i = i.name_next
                        }
                    }
                },
                lookupNode: function(e, i) {
                    var n, t, r, _ = FS.mayLookup(e);
                    if (_) throw new FS.ErrnoError(_, e);
                    for (n = FS.hashName(e.id, i), t = FS.nameTable[n]; t; t = t.name_next)
                        if (r = t.name, t.parent.id === e.id && r === i) return t;
                    return FS.lookup(e, i)
                },
                createNode: function(e, i, n, t) {
                    var r, _, o;
                    return FS.FSNode || (FS.FSNode = function(e, i, n, t) {
                        e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = FS.nextInode++, this.name = i, this.mode = n, this.node_ops = {}, this.stream_ops = {}, this.rdev = t
                    }, FS.FSNode.prototype = {}, r = 292 | 73, _ = 146, Object.defineProperties(FS.FSNode.prototype, {
                        read: {
                            get: function() {
                                return (this.mode & r) === r
                            },
                            set: function(e) {
                                e ? this.mode |= r : this.mode &= ~r
                            }
                        },
                        write: {
                            get: function() {
                                return (this.mode & _) === _
                            },
                            set: function(e) {
                                e ? this.mode |= _ : this.mode &= ~_
                            }
                        },
                        isFolder: {
                            get: function() {
                                return FS.isDir(this.mode)
                            }
                        },
                        isDevice: {
                            get: function() {
                                return FS.isChrdev(this.mode)
                            }
                        }
                    })), o = new FS.FSNode(e, i, n, t), FS.hashAddNode(o), o
                },
                destroyNode: function(e) {
                    FS.hashRemoveNode(e)
                },
                isRoot: function(e) {
                    return e === e.parent
                },
                isMountpoint: function(e) {
                    return !!e.mounted
                },
                isFile: function(e) {
                    return 32768 === (61440 & e)
                },
                isDir: function(e) {
                    return 16384 === (61440 & e)
                },
                isLink: function(e) {
                    return 40960 === (61440 & e)
                },
                isChrdev: function(e) {
                    return 8192 === (61440 & e)
                },
                isBlkdev: function(e) {
                    return 24576 === (61440 & e)
                },
                isFIFO: function(e) {
                    return 4096 === (61440 & e)
                },
                isSocket: function(e) {
                    return 49152 === (49152 & e)
                },
                flagModes: {
                    r: 0,
                    rs: 1052672,
                    "r+": 2,
                    w: 577,
                    wx: 705,
                    xw: 705,
                    "w+": 578,
                    "wx+": 706,
                    "xw+": 706,
                    a: 1089,
                    ax: 1217,
                    xa: 1217,
                    "a+": 1090,
                    "ax+": 1218,
                    "xa+": 1218
                },
                modeStringToFlags: function(e) {
                    var i = FS.flagModes[e];
                    if ("undefined" == typeof i) throw new Error("Unknown file open mode: " + e);
                    return i
                },
                flagsToPermissionString: function(e) {
                    var i = ["r", "w", "rw"][3 & e];
                    return 512 & e && (i += "w"), i
                },
                nodePermissions: function(e, i) {
                    return FS.ignorePermissions ? 0 : (i.indexOf("r") === -1 || 292 & e.mode) && (i.indexOf("w") === -1 || 146 & e.mode) && (i.indexOf("x") === -1 || 73 & e.mode) ? 0 : ERRNO_CODES.EACCES
                },
                mayLookup: function(e) {
                    var i = FS.nodePermissions(e, "x");
                    return i ? i : e.node_ops.lookup ? 0 : ERRNO_CODES.EACCES
                },
                mayCreate: function(e, i) {
                    try {
                        var n = FS.lookupNode(e, i);
                        return ERRNO_CODES.EEXIST
                    } catch (t) {}
                    return FS.nodePermissions(e, "wx")
                },
                mayDelete: function(e, i, n) {
                    var t, r;
                    try {
                        t = FS.lookupNode(e, i)
                    } catch (_) {
                        return _.errno
                    }
                    if (r = FS.nodePermissions(e, "wx"), r) return r;
                    if (n) {
                        if (!FS.isDir(t.mode)) return ERRNO_CODES.ENOTDIR;
                        if (FS.isRoot(t) || FS.getPath(t) === FS.cwd()) return ERRNO_CODES.EBUSY
                    } else if (FS.isDir(t.mode)) return ERRNO_CODES.EISDIR;
                    return 0
                },
                mayOpen: function(e, i) {
                    return e ? FS.isLink(e.mode) ? ERRNO_CODES.ELOOP : FS.isDir(e.mode) && ("r" !== FS.flagsToPermissionString(i) || 512 & i) ? ERRNO_CODES.EISDIR : FS.nodePermissions(e, FS.flagsToPermissionString(i)) : ERRNO_CODES.ENOENT
                },
                MAX_OPEN_FDS: 4096,
                nextfd: function(e, i) {
                    e = e || 0, i = i || FS.MAX_OPEN_FDS;
                    for (var n = e; i >= n; n++)
                        if (!FS.streams[n]) return n;
                    throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
                },
                getStream: function(e) {
                    return FS.streams[e]
                },
                createStream: function(e, i, n) {
                    var t, r, _;
                    FS.FSStream || (FS.FSStream = function() {}, FS.FSStream.prototype = {}, Object.defineProperties(FS.FSStream.prototype, {
                        object: {
                            get: function() {
                                return this.node
                            },
                            set: function(e) {
                                this.node = e
                            }
                        },
                        isRead: {
                            get: function() {
                                return 1 !== (2097155 & this.flags)
                            }
                        },
                        isWrite: {
                            get: function() {
                                return 0 !== (2097155 & this.flags)
                            }
                        },
                        isAppend: {
                            get: function() {
                                return 1024 & this.flags
                            }
                        }
                    })), t = new FS.FSStream;
                    for (r in e) t[r] = e[r];
                    return e = t, _ = FS.nextfd(i, n), e.fd = _, FS.streams[_] = e, e
                },
                closeStream: function(e) {
                    FS.streams[e] = null
                },
                chrdev_stream_ops: {
                    open: function(e) {
                        var i = FS.getDevice(e.node.rdev);
                        e.stream_ops = i.stream_ops, e.stream_ops.open && e.stream_ops.open(e)
                    },
                    llseek: function() {
                        throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                    }
                },
                major: function(e) {
                    return e >> 8
                },
                minor: function(e) {
                    return 255 & e
                },
                makedev: function(e, i) {
                    return e << 8 | i
                },
                registerDevice: function(e, i) {
                    FS.devices[e] = {
                        stream_ops: i
                    }
                },
                getDevice: function(e) {
                    return FS.devices[e]
                },
                getMounts: function(e) {
                    var i, n = [],
                        t = [e];
                    while (t.length) i = t.pop(), n.push(i), t.push.apply(t, i.mounts);
                    return n
                },
                syncfs: function(e, i) {
                    function n(e) {
                        return assert(FS.syncFSRequests > 0), FS.syncFSRequests--, i(e)
                    }

                    function t(e) {
                        if (e) {
                            if (!t.errored) return t.errored = !0, n(e)
                        } else ++_ >= r.length && n(null)
                    }
                    var r, _;
                    "function" == typeof e && (i = e, e = !1), FS.syncFSRequests++, FS.syncFSRequests > 1 && console.log("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work"), r = FS.getMounts(FS.root.mount), _ = 0, r.forEach(function(i) {
                        return i.type.syncfs ? (i.type.syncfs(i, e, t), undefined) : t(null)
                    })
                },
                mount: function(e, i, n) {
                    var t, r, _, o, a = "/" === n,
                        l = !n;
                    if (a && FS.root) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                    if (!a && !l) {
                        if (r = FS.lookupPath(n, {
                                follow_mount: !1
                            }), n = r.path, t = r.node, FS.isMountpoint(t)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                        if (!FS.isDir(t.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                    }
                    return _ = {
                        type: e,
                        opts: i,
                        mountpoint: n,
                        mounts: []
                    }, o = e.mount(_), o.mount = _, _.root = o, a ? FS.root = o : t && (t.mounted = _, t.mount && t.mount.mounts.push(_)), o
                },
                unmount: function(e) {
                    var i, n, t, r, _ = FS.lookupPath(e, {
                        follow_mount: !1
                    });
                    if (!FS.isMountpoint(_.node)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    i = _.node, n = i.mounted, t = FS.getMounts(n), Object.keys(FS.nameTable).forEach(function(e) {
                        var i, n = FS.nameTable[e];
                        while (n) i = n.name_next, t.indexOf(n.mount) !== -1 && FS.destroyNode(n), n = i
                    }), i.mounted = null, r = i.mount.mounts.indexOf(n), assert(r !== -1), i.mount.mounts.splice(r, 1)
                },
                lookup: function(e, i) {
                    return e.node_ops.lookup(e, i)
                },
                mknod: function(e, i, n) {
                    var t, r = FS.lookupPath(e, {
                            parent: !0
                        }),
                        _ = r.node,
                        o = PATH.basename(e);
                    if (!o || "." === o || ".." === o) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (t = FS.mayCreate(_, o), t) throw new FS.ErrnoError(t);
                    if (!_.node_ops.mknod) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    return _.node_ops.mknod(_, o, i, n)
                },
                create: function(e, i) {
                    return i = undefined !== i ? i : 438, i &= 4095, i |= 32768, FS.mknod(e, i, 0)
                },
                mkdir: function(e, i) {
                    return i = undefined !== i ? i : 511, i &= 511 | 512, i |= 16384, FS.mknod(e, i, 0)
                },
                mkdirTree: function(e, i) {
                    var n, t = e.split("/"),
                        r = "";
                    for (n = 0; n < t.length; ++n)
                        if (t[n]) {
                            r += "/" + t[n];
                            try {
                                FS.mkdir(r, i)
                            } catch (_) {
                                if (_.errno != ERRNO_CODES.EEXIST) throw _
                            }
                        }
                },
                mkdev: function(e, i, n) {
                    return "undefined" == typeof n && (n = i, i = 438), i |= 8192, FS.mknod(e, i, n)
                },
                symlink: function(e, i) {
                    var n, t, r, _;
                    if (!PATH.resolve(e)) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (n = FS.lookupPath(i, {
                            parent: !0
                        }), t = n.node, !t) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (r = PATH.basename(i), _ = FS.mayCreate(t, r), _) throw new FS.ErrnoError(_);
                    if (!t.node_ops.symlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    return t.node_ops.symlink(t, r, e)
                },
                rename: function(e, i) {
                    var n, t, r, _, o, a, l, u, s = PATH.dirname(e),
                        c = PATH.dirname(i),
                        f = PATH.basename(e),
                        d = PATH.basename(i);
                    try {
                        n = FS.lookupPath(e, {
                            parent: !0
                        }), t = n.node, n = FS.lookupPath(i, {
                            parent: !0
                        }), r = n.node
                    } catch (p) {
                        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                    }
                    if (!t || !r) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (t.mount !== r.mount) throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
                    if (_ = FS.lookupNode(t, f), o = PATH.relative(e, c), "." !== o.charAt(0)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (o = PATH.relative(i, s), "." !== o.charAt(0)) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
                    try {
                        a = FS.lookupNode(r, d)
                    } catch (p) {}
                    if (_ !== a) {
                        if (l = FS.isDir(_.mode), u = FS.mayDelete(t, f, l), u) throw new FS.ErrnoError(u);
                        if (u = a ? FS.mayDelete(r, d, l) : FS.mayCreate(r, d), u) throw new FS.ErrnoError(u);
                        if (!t.node_ops.rename) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                        if (FS.isMountpoint(_) || a && FS.isMountpoint(a)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                        if (r !== t && (u = FS.nodePermissions(t, "w"), u)) throw new FS.ErrnoError(u);
                        try {
                            FS.trackingDelegate["willMovePath"] && FS.trackingDelegate["willMovePath"](e, i)
                        } catch (p) {
                            console.log("FS.trackingDelegate['willMovePath']('" + e + "', '" + i + "') threw an exception: " + p.message)
                        }
                        FS.hashRemoveNode(_);
                        try {
                            t.node_ops.rename(_, r, d)
                        } catch (p) {
                            throw p
                        } finally {
                            FS.hashAddNode(_)
                        }
                        try {
                            FS.trackingDelegate["onMovePath"] && FS.trackingDelegate["onMovePath"](e, i)
                        } catch (p) {
                            console.log("FS.trackingDelegate['onMovePath']('" + e + "', '" + i + "') threw an exception: " + p.message)
                        }
                    }
                },
                rmdir: function(e) {
                    var i = FS.lookupPath(e, {
                            parent: !0
                        }),
                        n = i.node,
                        t = PATH.basename(e),
                        r = FS.lookupNode(n, t),
                        _ = FS.mayDelete(n, t, !0);
                    if (_) throw new FS.ErrnoError(_);
                    if (!n.node_ops.rmdir) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    if (FS.isMountpoint(r)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                    try {
                        FS.trackingDelegate["willDeletePath"] && FS.trackingDelegate["willDeletePath"](e)
                    } catch (o) {
                        console.log("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + o.message)
                    }
                    n.node_ops.rmdir(n, t), FS.destroyNode(r);
                    try {
                        FS.trackingDelegate["onDeletePath"] && FS.trackingDelegate["onDeletePath"](e)
                    } catch (o) {
                        console.log("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + o.message)
                    }
                },
                readdir: function(e) {
                    var i = FS.lookupPath(e, {
                            follow: !0
                        }),
                        n = i.node;
                    if (!n.node_ops.readdir) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
                    return n.node_ops.readdir(n)
                },
                unlink: function(e) {
                    var i = FS.lookupPath(e, {
                            parent: !0
                        }),
                        n = i.node,
                        t = PATH.basename(e),
                        r = FS.lookupNode(n, t),
                        _ = FS.mayDelete(n, t, !1);
                    if (_) throw new FS.ErrnoError(_);
                    if (!n.node_ops.unlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    if (FS.isMountpoint(r)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                    try {
                        FS.trackingDelegate["willDeletePath"] && FS.trackingDelegate["willDeletePath"](e)
                    } catch (o) {
                        console.log("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + o.message)
                    }
                    n.node_ops.unlink(n, t), FS.destroyNode(r);
                    try {
                        FS.trackingDelegate["onDeletePath"] && FS.trackingDelegate["onDeletePath"](e)
                    } catch (o) {
                        console.log("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + o.message)
                    }
                },
                readlink: function(e) {
                    var i = FS.lookupPath(e),
                        n = i.node;
                    if (!n) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (!n.node_ops.readlink) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    return PATH.resolve(FS.getPath(n.parent), n.node_ops.readlink(n))
                },
                stat: function(e, i) {
                    var n = FS.lookupPath(e, {
                            follow: !i
                        }),
                        t = n.node;
                    if (!t) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (!t.node_ops.getattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    return t.node_ops.getattr(t)
                },
                lstat: function(e) {
                    return FS.stat(e, !0)
                },
                chmod: function(e, i, n) {
                    var t, r;
                    if ("string" == typeof e ? (r = FS.lookupPath(e, {
                            follow: !n
                        }), t = r.node) : t = e, !t.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    t.node_ops.setattr(t, {
                        mode: 4095 & i | t.mode & ~4095,
                        timestamp: Date.now()
                    })
                },
                lchmod: function(e, i) {
                    FS.chmod(e, i, !0)
                },
                fchmod: function(e, i) {
                    var n = FS.getStream(e);
                    if (!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    FS.chmod(n.node, i)
                },
                chown: function(e, i, n, t) {
                    var r, _;
                    if ("string" == typeof e ? (_ = FS.lookupPath(e, {
                            follow: !t
                        }), r = _.node) : r = e, !r.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    r.node_ops.setattr(r, {
                        timestamp: Date.now()
                    })
                },
                lchown: function(e, i, n) {
                    FS.chown(e, i, n, !0)
                },
                fchown: function(e, i, n) {
                    var t = FS.getStream(e);
                    if (!t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    FS.chown(t.node, i, n)
                },
                truncate: function(e, i) {
                    var n, t, r;
                    if (0 > i) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if ("string" == typeof e ? (t = FS.lookupPath(e, {
                            follow: !0
                        }), n = t.node) : n = e, !n.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    if (FS.isDir(n.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
                    if (!FS.isFile(n.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (r = FS.nodePermissions(n, "w"), r) throw new FS.ErrnoError(r);
                    n.node_ops.setattr(n, {
                        size: i,
                        timestamp: Date.now()
                    })
                },
                ftruncate: function(e, i) {
                    var n = FS.getStream(e);
                    if (!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (0 === (2097155 & n.flags)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    FS.truncate(n.node, i)
                },
                utime: function(e, i, n) {
                    var t = FS.lookupPath(e, {
                            follow: !0
                        }),
                        r = t.node;
                    r.node_ops.setattr(r, {
                        timestamp: Math.max(i, n)
                    })
                },
                open: function(e, i, n, t, r) {
                    var _, o, a, l, u, s;
                    if ("" === e) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (i = "string" == typeof i ? FS.modeStringToFlags(i) : i, n = "undefined" == typeof n ? 438 : n, n = 64 & i ? 4095 & n | 32768 : 0, "object" == typeof e) _ = e;
                    else {
                        e = PATH.normalize(e);
                        try {
                            o = FS.lookupPath(e, {
                                follow: !(131072 & i)
                            }), _ = o.node
                        } catch (c) {}
                    }
                    if (a = !1, 64 & i)
                        if (_) {
                            if (128 & i) throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
                        } else _ = FS.mknod(e, n, 0), a = !0;
                    if (!_) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (FS.isChrdev(_.mode) && (i &= ~512), 65536 & i && !FS.isDir(_.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
                    if (!a && (l = FS.mayOpen(_, i), l)) throw new FS.ErrnoError(l);
                    512 & i && FS.truncate(_, 0), i &= ~(128 | 512), u = FS.createStream({
                        node: _,
                        path: FS.getPath(_),
                        flags: i,
                        seekable: !0,
                        position: 0,
                        stream_ops: _.stream_ops,
                        ungotten: [],
                        error: !1
                    }, t, r), u.stream_ops.open && u.stream_ops.open(u), !Module["logReadFiles"] || 1 & i || (FS.readFiles || (FS.readFiles = {}), e in FS.readFiles || (FS.readFiles[e] = 1, l("read file: " + e)));
                    try {
                        FS.trackingDelegate["onOpenFile"] && (s = 0, 1 !== (2097155 & i) && (s |= FS.tracking.openFlags.READ), 0 !== (2097155 & i) && (s |= FS.tracking.openFlags.WRITE), FS.trackingDelegate["onOpenFile"](e, s))
                    } catch (c) {
                        console.log("FS.trackingDelegate['onOpenFile']('" + e + "', flags) threw an exception: " + c.message)
                    }
                    return u
                },
                close: function(e) {
                    if (FS.isClosed(e)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    e.getdents && (e.getdents = null);
                    try {
                        e.stream_ops.close && e.stream_ops.close(e)
                    } catch (i) {
                        throw i
                    } finally {
                        FS.closeStream(e.fd)
                    }
                    e.fd = null
                },
                isClosed: function(e) {
                    return null === e.fd
                },
                llseek: function(e, i, n) {
                    if (FS.isClosed(e)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (!e.seekable || !e.stream_ops.llseek) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
                    return e.position = e.stream_ops.llseek(e, i, n), e.ungotten = [], e.position
                },
                read: function(e, i, n, t, r) {
                    var _, o;
                    if (0 > t || 0 > r) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (FS.isClosed(e)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (1 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
                    if (!e.stream_ops.read) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (_ = "undefined" != typeof r, _) {
                        if (!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                    } else r = e.position;
                    return o = e.stream_ops.read(e, i, n, t, r), _ || (e.position += o), o
                },
                write: function(e, i, n, t, r, _) {
                    var o, a;
                    if (0 > t || 0 > r) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (FS.isClosed(e)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (0 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
                    if (!e.stream_ops.write) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (1024 & e.flags && FS.llseek(e, 0, 2), o = "undefined" != typeof r, o) {
                        if (!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                    } else r = e.position;
                    a = e.stream_ops.write(e, i, n, t, r, _), o || (e.position += a);
                    try {
                        e.path && FS.trackingDelegate["onWriteToFile"] && FS.trackingDelegate["onWriteToFile"](e.path)
                    } catch (l) {
                        console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + l.message)
                    }
                    return a
                },
                allocate: function(e, i, n) {
                    if (FS.isClosed(e)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (0 > i || 0 >= n) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (0 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (!FS.isFile(e.node.mode) && !FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                    if (!e.stream_ops.allocate) throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
                    e.stream_ops.allocate(e, i, n)
                },
                mmap: function(e, i, n, t, r, _, o) {
                    if (1 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EACCES);
                    if (!e.stream_ops.mmap) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                    return e.stream_ops.mmap(e, i, n, t, r, _, o)
                },
                msync: function(e, i, n, t, r) {
                    return e && e.stream_ops.msync ? e.stream_ops.msync(e, i, n, t, r) : 0
                },
                munmap: function(e) {
                    return 0
                },
                ioctl: function(e, i, n) {
                    if (!e.stream_ops.ioctl) throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
                    return e.stream_ops.ioctl(e, i, n)
                },
                readFile: function(e, i) {
                    var n, t, r, _, o;
                    if (i = i || {}, i.flags = i.flags || "r", i.encoding = i.encoding || "binary", "utf8" !== i.encoding && "binary" !== i.encoding) throw new Error('Invalid encoding type "' + i.encoding + '"');
                    return t = FS.open(e, i.flags), r = FS.stat(e), _ = r.size, o = new Uint8Array(_), FS.read(t, o, 0, _, 0), "utf8" === i.encoding ? n = UTF8ArrayToString(o, 0) : "binary" === i.encoding && (n = o), FS.close(t), n
                },
                writeFile: function(e, i, n) {
                    var t, r, _;
                    if (n = n || {}, n.flags = n.flags || "w", t = FS.open(e, n.flags, n.mode), "string" == typeof i) r = new Uint8Array(lengthBytesUTF8(i) + 1), _ = stringToUTF8Array(i, r, 0, r.length), FS.write(t, r, 0, _, undefined, n.canOwn);
                    else {
                        if (!ArrayBuffer.isView(i)) throw new Error("Unsupported data type");
                        FS.write(t, i, 0, i.byteLength, undefined, n.canOwn)
                    }
                    FS.close(t)
                },
                cwd: function() {
                    return FS.currentPath
                },
                chdir: function(e) {
                    var i, n = FS.lookupPath(e, {
                        follow: !0
                    });
                    if (null === n.node) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (!FS.isDir(n.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
                    if (i = FS.nodePermissions(n.node, "x"), i) throw new FS.ErrnoError(i);
                    FS.currentPath = n.path
                },
                createDefaultDirectories: function() {
                    FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user")
                },
                createDefaultDevices: function() {
                    var e, i;
                    FS.mkdir("/dev"), FS.registerDevice(FS.makedev(1, 3), {
                        read: function() {
                            return 0
                        },
                        write: function(e, i, n, t, r) {
                            return t
                        }
                    }), FS.mkdev("/dev/null", FS.makedev(1, 3)), TTY.register(FS.makedev(5, 0), TTY.default_tty_ops), TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops), FS.mkdev("/dev/tty", FS.makedev(5, 0)), FS.mkdev("/dev/tty1", FS.makedev(6, 0)), "undefined" != typeof crypto ? (i = new Uint8Array(1), e = function() {
                        return crypto.getRandomValues(i), i[0]
                    }) : e = ENVIRONMENT_IS_NODE ? function() {
                        return require("crypto")["randomBytes"](1)[0]
                    } : function() {
                        return 256 * Math.random() | 0
                    }, FS.createDevice("/dev", "random", e), FS.createDevice("/dev", "urandom", e), FS.mkdir("/dev/shm"), FS.mkdir("/dev/shm/tmp")
                },
                createSpecialDirectories: function() {
                    FS.mkdir("/proc"), FS.mkdir("/proc/self"), FS.mkdir("/proc/self/fd"), FS.mount({
                        mount: function() {
                            var e = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
                            return e.node_ops = {
                                lookup: function(e, i) {
                                    var n, t = +i,
                                        r = FS.getStream(t);
                                    if (!r) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                                    return n = {
                                        parent: null,
                                        mount: {
                                            mountpoint: "fake"
                                        },
                                        node_ops: {
                                            readlink: function() {
                                                return r.path
                                            }
                                        }
                                    }, n.parent = n, n
                                }
                            }, e
                        }
                    }, {}, "/proc/self/fd")
                },
                createStandardStreams: function() {
                    var e, i, n;
                    Module["stdin"] ? FS.createDevice("/dev", "stdin", Module["stdin"]) : FS.symlink("/dev/tty", "/dev/stdin"), Module["stdout"] ? FS.createDevice("/dev", "stdout", null, Module["stdout"]) : FS.symlink("/dev/tty", "/dev/stdout"), Module["stderr"] ? FS.createDevice("/dev", "stderr", null, Module["stderr"]) : FS.symlink("/dev/tty1", "/dev/stderr"), e = FS.open("/dev/stdin", "r"), assert(0 === e.fd, "invalid handle for stdin (" + e.fd + ")"), i = FS.open("/dev/stdout", "w"), assert(1 === i.fd, "invalid handle for stdout (" + i.fd + ")"), n = FS.open("/dev/stderr", "w"), assert(2 === n.fd, "invalid handle for stderr (" + n.fd + ")")
                },
                ensureErrnoError: function() {
                    FS.ErrnoError || (FS.ErrnoError = function e(i, n) {
                        this.node = n, this.setErrno = function(e) {
                            this.errno = e;
                            for (var i in ERRNO_CODES)
                                if (ERRNO_CODES[i] === e) {
                                    this.code = i;
                                    break
                                }
                        }, this.setErrno(i), this.message = ERRNO_MESSAGES[i], this.stack && Object.defineProperty(this, "stack", {
                            value: (new Error).stack,
                            writable: !0
                        })
                    }, FS.ErrnoError.prototype = new Error, FS.ErrnoError.prototype.constructor = FS.ErrnoError, [ERRNO_CODES.ENOENT].forEach(function(e) {
                        FS.genericErrors[e] = new FS.ErrnoError(e), FS.genericErrors[e].stack = "<generic error, no stack>"
                    }))
                },
                staticInit: function() {
                    FS.ensureErrnoError(), FS.nameTable = new Array(4096), FS.mount(MEMFS, {}, "/"), FS.createDefaultDirectories(), FS.createDefaultDevices(), FS.createSpecialDirectories(), FS.filesystems = {
                        MEMFS: MEMFS,
                        IDBFS: IDBFS,
                        NODEFS: NODEFS,
                        WORKERFS: WORKERFS
                    }
                },
                init: function(e, i, n) {
                    assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), FS.init.initialized = !0, FS.ensureErrnoError(), Module["stdin"] = e || Module["stdin"], Module["stdout"] = i || Module["stdout"], Module["stderr"] = n || Module["stderr"], FS.createStandardStreams()
                },
                quit: function() {
                    var e, i, n;
                    for (FS.init.initialized = !1, e = Module["_fflush"], e && e(0), i = 0; i < FS.streams.length; i++) n = FS.streams[i], n && FS.close(n)
                },
                getMode: function(e, i) {
                    var n = 0;
                    return e && (n |= 292 | 73), i && (n |= 146), n
                },
                joinPath: function(e, i) {
                    var n = PATH.join.apply(null, e);
                    return i && "/" == n[0] && (n = n.substr(1)), n
                },
                absolutePath: function(e, i) {
                    return PATH.resolve(i, e)
                },
                standardizePath: function(e) {
                    return PATH.normalize(e)
                },
                findObject: function(e, i) {
                    var n = FS.analyzePath(e, i);
                    return n.exists ? n.object : (___setErrNo(n.error), null)
                },
                analyzePath: function(e, i) {
                    var n, t;
                    try {
                        n = FS.lookupPath(e, {
                            follow: !i
                        }), e = n.path
                    } catch (r) {}
                    t = {
                        isRoot: !1,
                        exists: !1,
                        error: 0,
                        name: null,
                        path: null,
                        object: null,
                        parentExists: !1,
                        parentPath: null,
                        parentObject: null
                    };
                    try {
                        n = FS.lookupPath(e, {
                            parent: !0
                        }), t.parentExists = !0, t.parentPath = n.path, t.parentObject = n.node, t.name = PATH.basename(e), n = FS.lookupPath(e, {
                            follow: !i
                        }), t.exists = !0, t.path = n.path, t.object = n.node, t.name = n.node.name, t.isRoot = "/" === n.path
                    } catch (r) {
                        t.error = r.errno
                    }
                    return t
                },
                createFolder: function(e, i, n, t) {
                    var r = PATH.join2("string" == typeof e ? e : FS.getPath(e), i),
                        _ = FS.getMode(n, t);
                    return FS.mkdir(r, _)
                },
                createPath: function(e, i, n, t) {
                    var r, _, o;
                    e = "string" == typeof e ? e : FS.getPath(e), r = i.split("/").reverse();
                    while (r.length)
                        if (_ = r.pop(), _) {
                            o = PATH.join2(e, _);
                            try {
                                FS.mkdir(o)
                            } catch (a) {}
                            e = o
                        } return o
                },
                createFile: function(e, i, n, t, r) {
                    var _ = PATH.join2("string" == typeof e ? e : FS.getPath(e), i),
                        o = FS.getMode(t, r);
                    return FS.create(_, o)
                },
                createDataFile: function(e, i, n, t, r, _) {
                    var o, a, l, u, s = i ? PATH.join2("string" == typeof e ? e : FS.getPath(e), i) : e,
                        c = FS.getMode(t, r),
                        f = FS.create(s, c);
                    if (n) {
                        if ("string" == typeof n) {
                            for (o = new Array(n.length), a = 0, l = n.length; l > a; ++a) o[a] = n.charCodeAt(a);
                            n = o
                        }
                        FS.chmod(f, 146 | c), u = FS.open(f, "w"), FS.write(u, n, 0, n.length, 0, _), FS.close(u), FS.chmod(f, c)
                    }
                    return f
                },
                createDevice: function(e, i, n, t) {
                    var r, _ = PATH.join2("string" == typeof e ? e : FS.getPath(e), i),
                        o = FS.getMode(!!n, !!t);
                    return FS.createDevice.major || (FS.createDevice.major = 64), r = FS.makedev(FS.createDevice.major++, 0), FS.registerDevice(r, {
                        open: function(e) {
                            e.seekable = !1
                        },
                        close: function(e) {
                            t && t.buffer && t.buffer.length && t(10)
                        },
                        read: function(e, i, t, r, _) {
                            var o, a, l = 0;
                            for (o = 0; r > o; o++) {
                                try {
                                    a = n()
                                } catch (u) {
                                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                                }
                                if (undefined === a && 0 === l) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                                if (null === a || undefined === a) break;
                                l++, i[t + o] = a
                            }
                            return l && (e.node.timestamp = Date.now()), l
                        },
                        write: function(e, i, n, r, _) {
                            for (var o = 0; r > o; o++) try {
                                t(i[n + o])
                            } catch (a) {
                                throw new FS.ErrnoError(ERRNO_CODES.EIO)
                            }
                            return r && (e.node.timestamp = Date.now()), o
                        }
                    }), FS.mkdev(_, o, r)
                },
                createLink: function(e, i, n, t, r) {
                    var _ = PATH.join2("string" == typeof e ? e : FS.getPath(e), i);
                    return FS.symlink(n, _)
                },
                forceLoadFile: function(e) {
                    if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
                    var i = !0;
                    if ("undefined" != typeof XMLHttpRequest) throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                    if (!Module["read"]) throw new Error("Cannot load without read() or XMLHttpRequest.");
                    try {
                        e.contents = intArrayFromString(Module["read"](e.url), !0), e.usedBytes = e.contents.length
                    } catch (n) {
                        i = !1
                    }
                    return i || ___setErrNo(ERRNO_CODES.EIO), i
                },
                createLazyFile: function(e, i, n, t, r) {
                    function _() {
                        this.lengthKnown = !1, this.chunks = []
                    }
                    var o, a, l, u, s;
                    if (_.prototype.get = function c(e) {
                            var i, n;
                            return e > this.length - 1 || 0 > e ? undefined : (i = e % this.chunkSize, n = e / this.chunkSize | 0, this.getter(n)[i])
                        }, _.prototype.setDataGetter = function f(e) {
                            this.getter = e
                        }, _.prototype.cacheLength = function d() {
                            var e, i, t, r, _, o, a, l = new XMLHttpRequest;
                            if (l.open("HEAD", n, !1), l.send(null), !(l.status >= 200 && l.status < 300 || 304 === l.status)) throw new Error("Couldn't load " + n + ". Status: " + l.status);
                            e = Number(l.getResponseHeader("Content-length")), t = (i = l.getResponseHeader("Accept-Ranges")) && "bytes" === i, r = (i = l.getResponseHeader("Content-Encoding")) && "gzip" === i, _ = 1024 * 1024, t || (_ = e), o = function(i, t) {
                                if (i > t) throw new Error("invalid range (" + i + ", " + t + ") or no bytes requested!");
                                if (t > e - 1) throw new Error("only " + e + " bytes available! programmer error!");
                                var r = new XMLHttpRequest;
                                if (r.open("GET", n, !1), e !== _ && r.setRequestHeader("Range", "bytes=" + i + "-" + t), "undefined" != typeof Uint8Array && (r.responseType = "arraybuffer"), r.overrideMimeType && r.overrideMimeType("text/plain; charset=x-user-defined"), r.send(null), !(r.status >= 200 && r.status < 300 || 304 === r.status)) throw new Error("Couldn't load " + n + ". Status: " + r.status);
                                return undefined !== r.response ? new Uint8Array(r.response || []) : intArrayFromString(r.responseText || "", !0)
                            }, a = this, a.setDataGetter(function(i) {
                                var n = i * _,
                                    t = (i + 1) * _ - 1;
                                if (t = Math.min(t, e - 1), "undefined" == typeof a.chunks[i] && (a.chunks[i] = o(n, t)), "undefined" == typeof a.chunks[i]) throw new Error("doXHR failed!");
                                return a.chunks[i]
                            }), (r || !e) && (_ = e = 1, e = this.getter(0).length, _ = e, console.log("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = e, this._chunkSize = _, this.lengthKnown = !0
                        }, "undefined" != typeof XMLHttpRequest) {
                        if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                        o = new _, Object.defineProperties(o, {
                            length: {
                                get: function() {
                                    return this.lengthKnown || this.cacheLength(), this._length
                                }
                            },
                            chunkSize: {
                                get: function() {
                                    return this.lengthKnown || this.cacheLength(), this._chunkSize
                                }
                            }
                        }), a = {
                            isDevice: !1,
                            contents: o
                        }
                    } else a = {
                        isDevice: !1,
                        url: n
                    };
                    return l = FS.createFile(e, i, a, t, r), a.contents ? l.contents = a.contents : a.url && (l.contents = null, l.url = a.url), Object.defineProperties(l, {
                        usedBytes: {
                            get: function() {
                                return this.contents.length
                            }
                        }
                    }), u = {}, s = Object.keys(l.stream_ops), s.forEach(function(e) {
                        var i = l.stream_ops[e];
                        u[e] = function n() {
                            if (!FS.forceLoadFile(l)) throw new FS.ErrnoError(ERRNO_CODES.EIO);
                            return i.apply(null, arguments)
                        }
                    }), u.read = function p(e, i, n, t, r) {
                        var _, o, a;
                        if (!FS.forceLoadFile(l)) throw new FS.ErrnoError(ERRNO_CODES.EIO);
                        if (_ = e.node.contents, r >= _.length) return 0;
                        if (o = Math.min(_.length - r, t), assert(o >= 0), _.slice)
                            for (a = 0; o > a; a++) i[n + a] = _[r + a];
                        else
                            for (a = 0; o > a; a++) i[n + a] = _.get(r + a);
                        return o
                    }, l.stream_ops = u, l
                },
                createPreloadedFile: function(e, i, n, t, r, _, o, a, l, u) {
                    function s(n) {
                        function s(n) {
                            u && u(), a || FS.createDataFile(e, i, n, t, r, l), _ && _(), removeRunDependency(f)
                        }
                        var d = !1;
                        Module["preloadPlugins"].forEach(function(e) {
                            d || e["canHandle"](c) && (e["handle"](n, c, s, function() {
                                o && o(), removeRunDependency(f)
                            }), d = !0)
                        }), d || s(n)
                    }
                    var c, f;
                    Browser.init(), c = i ? PATH.resolve(PATH.join2(e, i)) : e, f = getUniqueRunDependency("cp " + c), addRunDependency(f), "string" == typeof n ? Browser.asyncLoad(n, function(e) {
                        s(e)
                    }, o) : s(n)
                },
                indexedDB: function() {
                    return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
                },
                DB_NAME: function() {
                    return "EM_FS_" + window.location.pathname
                },
                DB_VERSION: 20,
                DB_STORE_NAME: "FILE_DATA",
                saveFilesToDB: function(e, i, n) {
                    var t, r;
                    i = i || function() {}, n = n || function() {}, t = FS.indexedDB();
                    try {
                        r = t.open(FS.DB_NAME(), FS.DB_VERSION)
                    } catch (_) {
                        return n(_)
                    }
                    r.onupgradeneeded = function o() {
                        console.log("creating db");
                        var e = r.result;
                        e.createObjectStore(FS.DB_STORE_NAME)
                    }, r.onsuccess = function a() {
                        function t() {
                            0 == u ? i() : n()
                        }
                        var _ = r.result,
                            o = _.transaction([FS.DB_STORE_NAME], "readwrite"),
                            a = o.objectStore(FS.DB_STORE_NAME),
                            l = 0,
                            u = 0,
                            s = e.length;
                        e.forEach(function(e) {
                            var i = a.put(FS.analyzePath(e).object.contents, e);
                            i.onsuccess = function n() {
                                l++, l + u == s && t()
                            }, i.onerror = function r() {
                                u++, l + u == s && t()
                            }
                        }), o.onerror = n
                    }, r.onerror = n
                },
                loadFilesFromDB: function(e, i, n) {
                    var t, r;
                    i = i || function() {}, n = n || function() {}, t = FS.indexedDB();
                    try {
                        r = t.open(FS.DB_NAME(), FS.DB_VERSION)
                    } catch (_) {
                        return n(_)
                    }
                    r.onupgradeneeded = n, r.onsuccess = function o() {
                        function t() {
                            0 == l ? i() : n()
                        }
                        var _, o, a, l, u, s = r.result;
                        try {
                            _ = s.transaction([FS.DB_STORE_NAME], "readonly")
                        } catch (c) {
                            return n(c), undefined
                        }
                        o = _.objectStore(FS.DB_STORE_NAME), a = 0, l = 0, u = e.length, e.forEach(function(e) {
                            var i = o.get(e);
                            i.onsuccess = function n() {
                                FS.analyzePath(e).exists && FS.unlink(e), FS.createDataFile(PATH.dirname(e), PATH.basename(e), i.result, !0, !0, !0), a++, a + l == u && t()
                            }, i.onerror = function r() {
                                l++, a + l == u && t()
                            }
                        }), _.onerror = n
                    }, r.onerror = n
                }
            }, SYSCALLS = {
                DEFAULT_POLLMASK: 5,
                mappings: {},
                umask: 511,
                calculateAt: function(e, i) {
                    var n, t;
                    if ("/" !== i[0]) {
                        if (e === -100) n = FS.cwd();
                        else {
                            if (t = FS.getStream(e), !t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                            n = t.path
                        }
                        i = PATH.join2(n, i)
                    }
                    return i
                },
                doStat: function(e, i, n) {
                    try {
                        var t = e(i)
                    } catch (r) {
                        if (r && r.node && PATH.normalize(i) !== PATH.normalize(FS.getPath(r.node))) return -ERRNO_CODES.ENOTDIR;
                        throw r
                    }
                    return HEAP32[n >> 2] = t.dev, HEAP32[n + 4 >> 2] = 0, HEAP32[n + 8 >> 2] = t.ino, HEAP32[n + 12 >> 2] = t.mode, HEAP32[n + 16 >> 2] = t.nlink, HEAP32[n + 20 >> 2] = t.uid, HEAP32[n + 24 >> 2] = t.gid, HEAP32[n + 28 >> 2] = t.rdev, HEAP32[n + 32 >> 2] = 0, HEAP32[n + 36 >> 2] = t.size, HEAP32[n + 40 >> 2] = 4096, HEAP32[n + 44 >> 2] = t.blocks, HEAP32[n + 48 >> 2] = t.atime.getTime() / 1e3 | 0, HEAP32[n + 52 >> 2] = 0, HEAP32[n + 56 >> 2] = t.mtime.getTime() / 1e3 | 0, HEAP32[n + 60 >> 2] = 0, HEAP32[n + 64 >> 2] = t.ctime.getTime() / 1e3 | 0, HEAP32[n + 68 >> 2] = 0, HEAP32[n + 72 >> 2] = t.ino, 0
                },
                doMsync: function(e, i, n, t) {
                    var r = new Uint8Array(HEAPU8.subarray(e, e + n));
                    FS.msync(i, r, 0, n, t)
                },
                doMkdir: function(e, i) {
                    return e = PATH.normalize(e), "/" === e[e.length - 1] && (e = e.substr(0, e.length - 1)), FS.mkdir(e, i, 0), 0
                },
                doMknod: function(e, i, n) {
                    switch (61440 & i) {
                        case 32768:
                        case 8192:
                        case 24576:
                        case 4096:
                        case 49152:
                            break;
                        default:
                            return -ERRNO_CODES.EINVAL
                    }
                    return FS.mknod(e, i, n), 0
                },
                doReadlink: function(e, i, n) {
                    var t, r, _;
                    return 0 >= n ? -ERRNO_CODES.EINVAL : (t = FS.readlink(e), r = Math.min(n, lengthBytesUTF8(t)), _ = HEAP8[i + r], stringToUTF8(t, i, n + 1), HEAP8[i + r] = _, r)
                },
                doAccess: function(e, i) {
                    var n, t, r;
                    return i & ~7 ? -ERRNO_CODES.EINVAL : (t = FS.lookupPath(e, {
                        follow: !0
                    }), n = t.node, r = "", 4 & i && (r += "r"), 2 & i && (r += "w"), 1 & i && (r += "x"), r && FS.nodePermissions(n, r) ? -ERRNO_CODES.EACCES : 0)
                },
                doDup: function(e, i, n) {
                    var t = FS.getStream(n);
                    return t && FS.close(t), FS.open(e, i, 0, n, n).fd
                },
                doReadv: function(e, i, n, t) {
                    var r, _, o, a, l = 0;
                    for (r = 0; n > r; r++) {
                        if (_ = HEAP32[i + 8 * r >> 2], o = HEAP32[i + (8 * r + 4) >> 2], a = FS.read(e, HEAP8, _, o, t), 0 > a) return -1;
                        if (l += a, o > a) break
                    }
                    return l
                },
                doWritev: function(e, i, n, t) {
                    var r, _, o, a, l = 0;
                    for (r = 0; n > r; r++) {
                        if (_ = HEAP32[i + 8 * r >> 2], o = HEAP32[i + (8 * r + 4) >> 2], a = FS.write(e, HEAP8, _, o, t), 0 > a) return -1;
                        l += a
                    }
                    return l
                },
                varargs: 0,
                get: function(e) {
                    SYSCALLS.varargs += 4;
                    var i = HEAP32[SYSCALLS.varargs - 4 >> 2];
                    return i
                },
                getStr: function() {
                    var e = Pointer_stringify(SYSCALLS.get());
                    return e
                },
                getStreamFromFD: function() {
                    var e = FS.getStream(SYSCALLS.get());
                    if (!e) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    return e
                },
                getSocketFromFD: function() {
                    var e = SOCKFS.getSocket(SYSCALLS.get());
                    if (!e) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    return e
                },
                getSocketAddress: function(e) {
                    var i, n = SYSCALLS.get(),
                        t = SYSCALLS.get();
                    if (e && 0 === n) return null;
                    if (i = __read_sockaddr(n, t), i.errno) throw new FS.ErrnoError(i.errno);
                    return i.addr = DNS.lookup_addr(i.addr) || i.addr, i
                },
                get64: function() {
                    var e = SYSCALLS.get(),
                        i = SYSCALLS.get();
                    return assert(e >= 0 ? 0 === i : i === -1), e
                },
                getZero: function() {
                    assert(0 === SYSCALLS.get())
                }
            }, SOCKFS = {
                mount: function(e) {
                    return Module["websocket"] = Module["websocket"] && "object" == typeof Module["websocket"] ? Module["websocket"] : {}, Module["websocket"]._callbacks = {}, Module["websocket"]["on"] = function(e, i) {
                        return "function" == typeof i && (this._callbacks[e] = i), this
                    }, Module["websocket"].emit = function(e, i) {
                        "function" == typeof this._callbacks[e] && this._callbacks[e].call(this, i)
                    }, FS.createNode(null, "/", 16384 | 511, 0)
                },
                createSocket: function(e, i, n) {
                    var t, r, _, o, a = 1 == i;
                    return n && assert(a == (6 == n)), t = {
                        family: e,
                        type: i,
                        protocol: n,
                        server: null,
                        error: null,
                        peers: {},
                        pending: [],
                        recv_queue: [],
                        sock_ops: SOCKFS.websocket_sock_ops
                    }, r = SOCKFS.nextname(), _ = FS.createNode(SOCKFS.root, r, 49152, 0), _.sock = t, o = FS.createStream({
                        path: r,
                        node: _,
                        flags: FS.modeStringToFlags("r+"),
                        seekable: !1,
                        stream_ops: SOCKFS.stream_ops
                    }), t.stream = o, t
                },
                getSocket: function(e) {
                    var i = FS.getStream(e);
                    return i && FS.isSocket(i.node.mode) ? i.node.sock : null
                },
                stream_ops: {
                    poll: function(e) {
                        var i = e.node.sock;
                        return i.sock_ops.poll(i)
                    },
                    ioctl: function(e, i, n) {
                        var t = e.node.sock;
                        return t.sock_ops.ioctl(t, i, n)
                    },
                    read: function(e, i, n, t, r) {
                        var _ = e.node.sock,
                            o = _.sock_ops.recvmsg(_, t);
                        return o ? (i.set(o.buffer, n), o.buffer.length) : 0
                    },
                    write: function(e, i, n, t, r) {
                        var _ = e.node.sock;
                        return _.sock_ops.sendmsg(_, i, n, t)
                    },
                    close: function(e) {
                        var i = e.node.sock;
                        i.sock_ops.close(i)
                    }
                },
                nextname: function() {
                    return SOCKFS.nextname.current || (SOCKFS.nextname.current = 0), "socket[" + SOCKFS.nextname.current++ + "]"
                },
                websocket_sock_ops: {
                    createPeer: function(e, i, n) {
                        var t, r, _, o, a, l, u, s, c;
                        if ("object" == typeof i && (t = i, i = null, n = null), t)
                            if (t._socket) i = t._socket.remoteAddress, n = t._socket.remotePort;
                            else {
                                if (r = /ws[s]?:\/\/([^:]+):(\d+)/.exec(t.url), !r) throw new Error("WebSocket URL must be in the format ws(s)://address:port");
                                i = r[1], n = parseInt(r[2], 10)
                            }
                        else try {
                            _ = Module["websocket"] && "object" == typeof Module["websocket"], o = "ws:#".replace("#", "//"), _ && "string" == typeof Module["websocket"]["url"] && (o = Module["websocket"]["url"]), ("ws://" === o || "wss://" === o) && (a = i.split("/"), o = o + a[0] + ":" + n + "/" + a.slice(1).join("/")), l = "binary", _ && "string" == typeof Module["websocket"]["subprotocol"] && (l = Module["websocket"]["subprotocol"]), l = l.replace(/^ +| +$/g, "").split(/ *, */), u = ENVIRONMENT_IS_NODE ? {
                                protocol: l.toString()
                            } : l, _ && null === Module["websocket"]["subprotocol"] && (l = "null", u = undefined), s = ENVIRONMENT_IS_NODE ? require("ws") : ENVIRONMENT_IS_WEB ? window["WebSocket"] : WebSocket, t = new s(o, u), t.binaryType = "arraybuffer"
                        } catch (f) {
                            throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH)
                        }
                        return c = {
                            addr: i,
                            port: n,
                            socket: t,
                            dgram_send_queue: []
                        }, SOCKFS.websocket_sock_ops.addPeer(e, c), SOCKFS.websocket_sock_ops.handlePeerEvents(e, c), 2 === e.type && "undefined" != typeof e.sport && c.dgram_send_queue.push(new Uint8Array([255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (65280 & e.sport) >> 8, 255 & e.sport])), c
                    },
                    getPeer: function(e, i, n) {
                        return e.peers[i + ":" + n]
                    },
                    addPeer: function(e, i) {
                        e.peers[i.addr + ":" + i.port] = i
                    },
                    removePeer: function(e, i) {
                        delete e.peers[i.addr + ":" + i.port]
                    },
                    handlePeerEvents: function(e, i) {
                        function n(n) {
                            var r, _;
                            if (assert("string" != typeof n && undefined !== n.byteLength), 0 != n.byteLength) {
                                if (n = new Uint8Array(n), r = t, t = !1, r && 10 === n.length && 255 === n[0] && 255 === n[1] && 255 === n[2] && 255 === n[3] && n[4] === "p".charCodeAt(0) && n[5] === "o".charCodeAt(0) && n[6] === "r".charCodeAt(0) && n[7] === "t".charCodeAt(0)) return _ = n[8] << 8 | n[9], SOCKFS.websocket_sock_ops.removePeer(e, i), i.port = _, SOCKFS.websocket_sock_ops.addPeer(e, i), undefined;
                                e.recv_queue.push({
                                    addr: i.addr,
                                    port: i.port,
                                    data: n
                                }), Module["websocket"].emit("message", e.stream.fd)
                            }
                        }
                        var t = !0,
                            r = function() {
                                Module["websocket"].emit("open", e.stream.fd);
                                try {
                                    var n = i.dgram_send_queue.shift();
                                    while (n) i.socket.send(n), n = i.dgram_send_queue.shift()
                                } catch (t) {
                                    i.socket.close()
                                }
                            };
                        ENVIRONMENT_IS_NODE ? (i.socket.on("open", r), i.socket.on("message", function(e, i) {
                            i.binary && n(new Uint8Array(e).buffer)
                        }), i.socket.on("close", function() {
                            Module["websocket"].emit("close", e.stream.fd)
                        }), i.socket.on("error", function(i) {
                            e.error = ERRNO_CODES.ECONNREFUSED, Module["websocket"].emit("error", [e.stream.fd, e.error, "ECONNREFUSED: Connection refused"])
                        })) : (i.socket.onopen = r, i.socket.onclose = function() {
                            Module["websocket"].emit("close", e.stream.fd)
                        }, i.socket.onmessage = function _(e) {
                            n(e.data)
                        }, i.socket.onerror = function(i) {
                            e.error = ERRNO_CODES.ECONNREFUSED, Module["websocket"].emit("error", [e.stream.fd, e.error, "ECONNREFUSED: Connection refused"])
                        })
                    },
                    poll: function(e) {
                        var i, n;
                        return 1 === e.type && e.server ? e.pending.length ? 64 | 1 : 0 : (i = 0, n = 1 === e.type ? SOCKFS.websocket_sock_ops.getPeer(e, e.daddr, e.dport) : null, (e.recv_queue.length || !n || n && n.socket.readyState === n.socket.CLOSING || n && n.socket.readyState === n.socket.CLOSED) && (i |= 64 | 1), (!n || n && n.socket.readyState === n.socket.OPEN) && (i |= 4), (n && n.socket.readyState === n.socket.CLOSING || n && n.socket.readyState === n.socket.CLOSED) && (i |= 16), i)
                    },
                    ioctl: function(e, i, n) {
                        switch (i) {
                            case 21531:
                                var t = 0;
                                return e.recv_queue.length && (t = e.recv_queue[0].data.length), HEAP32[n >> 2] = t, 0;
                            default:
                                return ERRNO_CODES.EINVAL
                        }
                    },
                    close: function(e) {
                        var i, n, t;
                        if (e.server) {
                            try {
                                e.server.close()
                            } catch (r) {}
                            e.server = null
                        }
                        for (i = Object.keys(e.peers), n = 0; n < i.length; n++) {
                            t = e.peers[i[n]];
                            try {
                                t.socket.close()
                            } catch (r) {}
                            SOCKFS.websocket_sock_ops.removePeer(e, t)
                        }
                        return 0
                    },
                    bind: function(e, i, n) {
                        if ("undefined" != typeof e.saddr || "undefined" != typeof e.sport) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        if (e.saddr = i, e.sport = n, 2 === e.type) {
                            e.server && (e.server.close(), e.server = null);
                            try {
                                e.sock_ops.listen(e, 0)
                            } catch (t) {
                                if (!(t instanceof FS.ErrnoError)) throw t;
                                if (t.errno !== ERRNO_CODES.EOPNOTSUPP) throw t
                            }
                        }
                    },
                    connect: function(e, i, n) {
                        var t, r;
                        if (e.server) throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
                        if ("undefined" != typeof e.daddr && "undefined" != typeof e.dport && (t = SOCKFS.websocket_sock_ops.getPeer(e, e.daddr, e.dport), t)) throw t.socket.readyState === t.socket.CONNECTING ? new FS.ErrnoError(ERRNO_CODES.EALREADY) : new FS.ErrnoError(ERRNO_CODES.EISCONN);
                        throw r = SOCKFS.websocket_sock_ops.createPeer(e, i, n), e.daddr = r.addr, e.dport = r.port, new FS.ErrnoError(ERRNO_CODES.EINPROGRESS)
                    },
                    listen: function(e, i) {
                        var n, t;
                        if (!ENVIRONMENT_IS_NODE) throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
                        if (e.server) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        n = require("ws").Server, t = e.saddr, e.server = new n({
                            host: t,
                            port: e.sport
                        }), Module["websocket"].emit("listen", e.stream.fd), e.server.on("connection", function(i) {
                            var n, t;
                            1 === e.type ? (n = SOCKFS.createSocket(e.family, e.type, e.protocol), t = SOCKFS.websocket_sock_ops.createPeer(n, i), n.daddr = t.addr, n.dport = t.port, e.pending.push(n), Module["websocket"].emit("connection", n.stream.fd)) : (SOCKFS.websocket_sock_ops.createPeer(e, i), Module["websocket"].emit("connection", e.stream.fd))
                        }), e.server.on("closed", function() {
                            Module["websocket"].emit("close", e.stream.fd), e.server = null
                        }), e.server.on("error", function(i) {
                            e.error = ERRNO_CODES.EHOSTUNREACH, Module["websocket"].emit("error", [e.stream.fd, e.error, "EHOSTUNREACH: Host is unreachable"])
                        })
                    },
                    accept: function(e) {
                        if (!e.server) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        var i = e.pending.shift();
                        return i.stream.flags = e.stream.flags, i
                    },
                    getname: function(e, i) {
                        var n, t;
                        if (i) {
                            if (undefined === e.daddr || undefined === e.dport) throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
                            n = e.daddr, t = e.dport
                        } else n = e.saddr || 0, t = e.sport || 0;
                        return {
                            addr: n,
                            port: t
                        }
                    },
                    sendmsg: function(e, i, n, t, r, _) {
                        var o, a;
                        if (2 === e.type) {
                            if ((undefined === r || undefined === _) && (r = e.daddr, _ = e.dport), undefined === r || undefined === _) throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ)
                        } else r = e.daddr, _ = e.dport;
                        if (o = SOCKFS.websocket_sock_ops.getPeer(e, r, _), 1 === e.type) {
                            if (!o || o.socket.readyState === o.socket.CLOSING || o.socket.readyState === o.socket.CLOSED) throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
                            if (o.socket.readyState === o.socket.CONNECTING) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                        }
                        if (ArrayBuffer.isView(i) && (n += i.byteOffset, i = i.buffer), a = i.slice(n, n + t), 2 === e.type && (!o || o.socket.readyState !== o.socket.OPEN)) return o && o.socket.readyState !== o.socket.CLOSING && o.socket.readyState !== o.socket.CLOSED || (o = SOCKFS.websocket_sock_ops.createPeer(e, r, _)), o.dgram_send_queue.push(a), t;
                        try {
                            return o.socket.send(a), t
                        } catch (l) {
                            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                        }
                    },
                    recvmsg: function(e, i) {
                        var n, t, r, _, o, a, l, u;
                        if (1 === e.type && e.server) throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
                        if (n = e.recv_queue.shift(), !n) {
                            if (1 === e.type) {
                                if (t = SOCKFS.websocket_sock_ops.getPeer(e, e.daddr, e.dport), t) {
                                    if (t.socket.readyState === t.socket.CLOSING || t.socket.readyState === t.socket.CLOSED) return null;
                                    throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                                }
                                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)
                            }
                            throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                        }
                        return r = n.data.byteLength || n.data.length, _ = n.data.byteOffset || 0, o = n.data.buffer || n.data, a = Math.min(i, r), l = {
                            buffer: new Uint8Array(o, _, a),
                            addr: n.addr,
                            port: n.port
                        }, 1 === e.type && r > a && (u = r - a, n.data = new Uint8Array(o, _ + a, u), e.recv_queue.unshift(n)), l
                    }
                }
            }, DNS = {
                address_map: {
                    id: 1,
                    addrs: {},
                    names: {}
                },
                lookup_name: function(e) {
                    var i, n, t = __inet_pton4_raw(e);
                    return null !== t ? e : (t = __inet_pton6_raw(e), null !== t ? e : (DNS.address_map.addrs[e] ? i = DNS.address_map.addrs[e] : (n = DNS.address_map.id++, assert(65535 > n, "exceeded max address mappings of 65535"), i = "172.29." + (255 & n) + "." + (65280 & n), DNS.address_map.names[i] = e, DNS.address_map.addrs[e] = i), i))
                },
                lookup_addr: function(e) {
                    return DNS.address_map.names[e] ? DNS.address_map.names[e] : null
                }
            }, PROCINFO = {
                ppid: 1,
                pid: 42,
                sid: 42,
                pgid: 42
            }, PIPEFS = {
                BUCKET_BUFFER_SIZE: 8192,
                mount: function(e) {
                    return FS.createNode(null, "/", 16384 | 511, 0)
                },
                createPipe: function() {
                    var e, i, n, t, r, _, o = {
                        buckets: []
                    };
                    return o.buckets.push({
                        buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                        offset: 0,
                        roffset: 0
                    }), e = PIPEFS.nextname(), i = PIPEFS.nextname(), n = FS.createNode(PIPEFS.root, e, 4096, 0), t = FS.createNode(PIPEFS.root, i, 4096, 0), n.pipe = o, t.pipe = o, r = FS.createStream({
                        path: e,
                        node: n,
                        flags: FS.modeStringToFlags("r"),
                        seekable: !1,
                        stream_ops: PIPEFS.stream_ops
                    }), n.stream = r, _ = FS.createStream({
                        path: i,
                        node: t,
                        flags: FS.modeStringToFlags("w"),
                        seekable: !1,
                        stream_ops: PIPEFS.stream_ops
                    }), t.stream = _, {
                        readable_fd: r.fd,
                        writable_fd: _.fd
                    }
                },
                stream_ops: {
                    poll: function(e) {
                        var i, n, t = e.node.pipe;
                        if (1 === (2097155 & e.flags)) return 256 | 4;
                        if (t.buckets.length > 0)
                            for (i = 0; i < t.buckets.length; i++)
                                if (n = t.buckets[i], n.offset - n.roffset > 0) return 64 | 1;
                        return 0
                    },
                    ioctl: function(e, i, n) {
                        return ERRNO_CODES.EINVAL
                    },
                    read: function(e, i, n, t, r) {
                        var _, o, a, l, u, s, c, f, d, p = e.node.pipe,
                            m = 0;
                        for (_ = 0; _ < p.buckets.length; _++) o = p.buckets[_], m += o.offset - o.roffset;
                        if (assert(i instanceof ArrayBuffer || ArrayBuffer.isView(i)), a = i.subarray(n, n + t), 0 >= t) return 0;
                        if (0 == m) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                        for (l = Math.min(m, t), u = l, s = 0, _ = 0; _ < p.buckets.length; _++) {
                            if (c = p.buckets[_], f = c.offset - c.roffset, f >= l) {
                                d = c.buffer.subarray(c.roffset, c.offset), f > l ? (d = d.subarray(0, l), c.roffset += l) : s++, a.set(d);
                                break
                            }
                            d = c.buffer.subarray(c.roffset, c.offset), a.set(d), a = a.subarray(d.byteLength), l -= d.byteLength, s++
                        }
                        return s && s == p.buckets.length && (s--, p.buckets[s].offset = 0, p.buckets[s].roffset = 0), p.buckets.splice(0, s), u
                    },
                    write: function(e, i, n, t, r) {
                        var _, o, a, l, u, s, c, f, d = e.node.pipe;
                        if (assert(i instanceof ArrayBuffer || ArrayBuffer.isView(i)), _ = i.subarray(n, n + t), o = _.byteLength, 0 >= o) return 0;
                        if (a = null, 0 == d.buckets.length ? (a = {
                                buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                                offset: 0,
                                roffset: 0
                            }, d.buckets.push(a)) : a = d.buckets[d.buckets.length - 1], assert(a.offset <= PIPEFS.BUCKET_BUFFER_SIZE), l = PIPEFS.BUCKET_BUFFER_SIZE - a.offset, l >= o) return a.buffer.set(_, a.offset), a.offset += o, o;
                        for (l > 0 && (a.buffer.set(_.subarray(0, l), a.offset), a.offset += l, _ = _.subarray(l, _.byteLength)), u = _.byteLength / PIPEFS.BUCKET_BUFFER_SIZE | 0, s = _.byteLength % PIPEFS.BUCKET_BUFFER_SIZE, c = 0; u > c; c++) f = {
                            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                            offset: PIPEFS.BUCKET_BUFFER_SIZE,
                            roffset: 0
                        }, d.buckets.push(f), f.buffer.set(_.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE)), _ = _.subarray(PIPEFS.BUCKET_BUFFER_SIZE, _.byteLength);
                        return s > 0 && (f = {
                            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                            offset: _.byteLength,
                            roffset: 0
                        }, d.buckets.push(f), f.buffer.set(_)), o
                    },
                    close: function(e) {
                        var i = e.node.pipe;
                        i.buckets = null
                    }
                },
                nextname: function() {
                    return PIPEFS.nextname.current || (PIPEFS.nextname.current = 0), "pipe[" + PIPEFS.nextname.current++ + "]"
                }
            }, DLFCN = {
                error: null,
                errorMsg: null,
                loadedLibs: {},
                loadedLibNames: {}
            }, Browser = {
                mainLoop: {
                    scheduler: null,
                    method: "",
                    currentlyRunningMainloop: 0,
                    func: null,
                    arg: 0,
                    timingMode: 0,
                    timingValue: 0,
                    currentFrameNumber: 0,
                    queue: [],
                    pause: function() {
                        Browser.mainLoop.scheduler = null, Browser.mainLoop.currentlyRunningMainloop++
                    },
                    resume: function() {
                        var e, i, n;
                        Browser.mainLoop.currentlyRunningMainloop++, e = Browser.mainLoop.timingMode, i = Browser.mainLoop.timingValue, n = Browser.mainLoop.func, Browser.mainLoop.func = null, _emscripten_set_main_loop(n, 0, !1, Browser.mainLoop.arg, !0), _emscripten_set_main_loop_timing(e, i), Browser.mainLoop.scheduler()
                    },
                    updateStatus: function() {
                        var e, i, n;
                        Module["setStatus"] && (e = Module["statusMessage"] || "Please wait...", i = Browser.mainLoop.remainingBlockers, n = Browser.mainLoop.expectedBlockers, i ? n > i ? Module["setStatus"](e + " (" + (n - i) + "/" + n + ")") : Module["setStatus"](e) : Module["setStatus"](""))
                    },
                    runIter: function(e) {
                        if (!ABORT) {
                            if (Module["preMainLoop"]) {
                                var i = Module["preMainLoop"]();
                                if (i === !1) return
                            }
                            try {
                                e()
                            } catch (n) {
                                if (n instanceof ExitStatus) return;
                                throw n && "object" == typeof n && n.stack && err("exception thrown: " + [n, n.stack]), n
                            }
                            Module["postMainLoop"] && Module["postMainLoop"]()
                        }
                    }
                },
                isFullscreen: !1,
                pointerLock: !1,
                moduleContextCreatedCallbacks: [],
                workers: [],
                init: function() {
                    function e() {
                        Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]
                    }
                    var i, n, t;
                    if (Module["preloadPlugins"] || (Module["preloadPlugins"] = []), !Browser.initted) {
                        Browser.initted = !0;
                        try {
                            new Blob, Browser.hasBlobConstructor = !0
                        } catch (r) {
                            Browser.hasBlobConstructor = !1, console.log("warning: no blob constructor, cannot create blobs with mimetypes")
                        }
                        Browser.BlobBuilder = "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : Browser.hasBlobConstructor ? null : console.log("warning: no BlobBuilder"), Browser.URLObject = "undefined" != typeof window ? window.URL ? window.URL : window.webkitURL : undefined, Module.noImageDecoding || "undefined" != typeof Browser.URLObject || (console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."), Module.noImageDecoding = !0), i = {}, i["canHandle"] = function _(e) {
                            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(e)
                        }, i["handle"] = function o(e, i, n, t) {
                            var r, _, o, a = null;
                            if (Browser.hasBlobConstructor) try {
                                a = new Blob([e], {
                                    type: Browser.getMimetype(i)
                                }), a.size !== e.length && (a = new Blob([new Uint8Array(e).buffer], {
                                    type: Browser.getMimetype(i)
                                }))
                            } catch (l) {
                                warnOnce("Blob constructor present but fails: " + l + "; falling back to blob builder")
                            }
                            a || (r = new Browser.BlobBuilder, r.append(new Uint8Array(e).buffer), a = r.getBlob()), _ = Browser.URLObject.createObjectURL(a), o = new Image, o.onload = function u() {
                                var t, r;
                                assert(o.complete, "Image " + i + " could not be decoded"), t = document.createElement("canvas"), t.width = o.width, t.height = o.height, r = t.getContext("2d"), r.drawImage(o, 0, 0), Module["preloadedImages"][i] = t, Browser.URLObject.revokeObjectURL(_), n && n(e)
                            }, o.onerror = function s(e) {
                                console.log("Image " + _ + " could not be decoded"), t && t()
                            }, o.src = _
                        }, Module["preloadPlugins"].push(i), n = {}, n["canHandle"] = function a(e) {
                            return !Module.noAudioDecoding && e.substr(-4) in {
                                ".ogg": 1,
                                ".wav": 1,
                                ".mp3": 1
                            }
                        }, n["handle"] = function l(e, i, n, t) {
                            function r(t) {
                                u || (u = !0, Module["preloadedAudios"][i] = t, n && n(e))
                            }

                            function _() {
                                u || (u = !0, Module["preloadedAudios"][i] = new Audio, t && t())
                            }
                            var o, a, l, u = !1;
                            if (!Browser.hasBlobConstructor) return _();
                            try {
                                o = new Blob([e], {
                                    type: Browser.getMimetype(i)
                                })
                            } catch (s) {
                                return _()
                            }
                            a = Browser.URLObject.createObjectURL(o), l = new Audio, l.addEventListener("canplaythrough", function() {
                                r(l)
                            }, !1), l.onerror = function c(n) {
                                function t(e) {
                                    var i, n, t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                                        r = "=",
                                        _ = "",
                                        o = 0,
                                        a = 0;
                                    for (i = 0; i < e.length; i++) {
                                        o = o << 8 | e[i], a += 8;
                                        while (a >= 6) n = o >> a - 6 & 63, a -= 6, _ += t[n]
                                    }
                                    return 2 == a ? (_ += t[(3 & o) << 4], _ += r + r) : 4 == a && (_ += t[(15 & o) << 2], _ += r), _
                                }
                                u || (console.log("warning: browser could not fully decode audio " + i + ", trying slower base64 approach"), l.src = "data:audio/x-" + i.substr(-3) + ";base64," + t(e), r(l))
                            }, l.src = a, Browser.safeSetTimeout(function() {
                                r(l)
                            }, 1e4)
                        }, Module["preloadPlugins"].push(n), t = Module["canvas"], t && (t.requestPointerLock = t["requestPointerLock"] || t["mozRequestPointerLock"] || t["webkitRequestPointerLock"] || t["msRequestPointerLock"] || function() {}, t.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || function() {}, t.exitPointerLock = t.exitPointerLock.bind(document), document.addEventListener("pointerlockchange", e, !1), document.addEventListener("mozpointerlockchange", e, !1), document.addEventListener("webkitpointerlockchange", e, !1), document.addEventListener("mspointerlockchange", e, !1), Module["elementPointerLock"] && t.addEventListener("click", function(e) {
                            !Browser.pointerLock && Module["canvas"].requestPointerLock && (Module["canvas"].requestPointerLock(), e.preventDefault())
                        }, !1))
                    }
                },
                createContext: function(e, i, n, t) {
                    var r, _, o, a;
                    if (i && Module.ctx && e == Module.canvas) return Module.ctx;
                    if (i) {
                        if (o = {
                                antialias: !1,
                                alpha: !1
                            }, t)
                            for (a in t) o[a] = t[a];
                        _ = GL.createContext(e, o), _ && (r = GL.getContext(_).GLctx)
                    } else r = e.getContext("2d");
                    return r ? (n && (i || assert("undefined" == typeof GLctx, "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"), Module.ctx = r, i && GL.makeContextCurrent(_), Module.useWebGL = i, Browser.moduleContextCreatedCallbacks.forEach(function(e) {
                        e()
                    }), Browser.init()), r) : null
                },
                destroyContext: function(e, i, n) {},
                fullscreenHandlersInstalled: !1,
                lockPointer: undefined,
                resizeCanvas: undefined,
                requestFullscreen: function(e, i, n) {
                    function t() {
                        Browser.isFullscreen = !1;
                        var e = r.parentNode;
                        (document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === e ? (r.exitFullscreen = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || function() {}, r.exitFullscreen = r.exitFullscreen.bind(document), Browser.lockPointer && r.requestPointerLock(), Browser.isFullscreen = !0, Browser.resizeCanvas ? Browser.setFullscreenCanvasSize() : Browser.updateCanvasDimensions(r)) : (e.parentNode.insertBefore(r, e), e.parentNode.removeChild(e), Browser.resizeCanvas ? Browser.setWindowedCanvasSize() : Browser.updateCanvasDimensions(r)), Module["onFullScreen"] && Module["onFullScreen"](Browser.isFullscreen), Module["onFullscreen"] && Module["onFullscreen"](Browser.isFullscreen)
                    }
                    var r, _;
                    Browser.lockPointer = e, Browser.resizeCanvas = i, Browser.vrDevice = n, "undefined" == typeof Browser.lockPointer && (Browser.lockPointer = !0), "undefined" == typeof Browser.resizeCanvas && (Browser.resizeCanvas = !1), "undefined" == typeof Browser.vrDevice && (Browser.vrDevice = null), r = Module["canvas"], Browser.fullscreenHandlersInstalled || (Browser.fullscreenHandlersInstalled = !0, document.addEventListener("fullscreenchange", t, !1), document.addEventListener("mozfullscreenchange", t, !1), document.addEventListener("webkitfullscreenchange", t, !1), document.addEventListener("MSFullscreenChange", t, !1)), _ = document.createElement("div"), r.parentNode.insertBefore(_, r), _.appendChild(r), _.requestFullscreen = _["requestFullscreen"] || _["mozRequestFullScreen"] || _["msRequestFullscreen"] || (_["webkitRequestFullscreen"] ? function() {
                        _["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])
                    } : null) || (_["webkitRequestFullScreen"] ? function() {
                        _["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
                    } : null), n ? _.requestFullscreen({
                        vrDisplay: n
                    }) : _.requestFullscreen()
                },
                requestFullScreen: function(e, i, n) {
                    return err("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead."), Browser.requestFullScreen = function(e, i, n) {
                        return Browser.requestFullscreen(e, i, n)
                    }, Browser.requestFullscreen(e, i, n)
                },
                nextRAF: 0,
                fakeRequestAnimationFrame: function(e) {
                    var i, n = Date.now();
                    if (0 === Browser.nextRAF) Browser.nextRAF = n + 1e3 / 60;
                    else
                        while (n + 2 >= Browser.nextRAF) Browser.nextRAF += 1e3 / 60;
                    i = Math.max(Browser.nextRAF - n, 0), setTimeout(e, i)
                },
                requestAnimationFrame: function l(e) {
                    "undefined" == typeof window ? Browser.fakeRequestAnimationFrame(e) : (window.requestAnimationFrame || (window.requestAnimationFrame = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"] || Browser.fakeRequestAnimationFrame), window.requestAnimationFrame(e))
                },
                safeCallback: function(e) {
                    return function() {
                        return ABORT ? undefined : e.apply(null, arguments)
                    }
                },
                allowAsyncCallbacks: !0,
                queuedAsyncCallbacks: [],
                pauseAsyncCallbacks: function() {
                    Browser.allowAsyncCallbacks = !1
                },
                resumeAsyncCallbacks: function() {
                    if (Browser.allowAsyncCallbacks = !0, Browser.queuedAsyncCallbacks.length > 0) {
                        var e = Browser.queuedAsyncCallbacks;
                        Browser.queuedAsyncCallbacks = [], e.forEach(function(e) {
                            e()
                        })
                    }
                },
                safeRequestAnimationFrame: function(e) {
                    return Browser.requestAnimationFrame(function() {
                        ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
                    })
                },
                safeSetTimeout: function(e, i) {
                    return Module["noExitRuntime"] = !0, setTimeout(function() {
                        ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
                    }, i)
                },
                safeSetInterval: function(e, i) {
                    return Module["noExitRuntime"] = !0, setInterval(function() {
                        ABORT || Browser.allowAsyncCallbacks && e()
                    }, i)
                },
                getMimetype: function(e) {
                    return {
                        jpg: "image/jpeg",
                        jpeg: "image/jpeg",
                        png: "image/png",
                        bmp: "image/bmp",
                        ogg: "audio/ogg",
                        wav: "audio/wav",
                        mp3: "audio/mpeg"
                    } [e.substr(e.lastIndexOf(".") + 1)]
                },
                getUserMedia: function(e) {
                    window.getUserMedia || (window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]), window.getUserMedia(e)
                },
                getMovementX: function(e) {
                    return e["movementX"] || e["mozMovementX"] || e["webkitMovementX"] || 0
                },
                getMovementY: function(e) {
                    return e["movementY"] || e["mozMovementY"] || e["webkitMovementY"] || 0
                },
                getMouseWheelDelta: function(e) {
                    var i = 0;
                    switch (e.type) {
                        case "DOMMouseScroll":
                            i = e.detail;
                            break;
                        case "mousewheel":
                            i = e.wheelDelta;
                            break;
                        case "wheel":
                            i = e["deltaY"];
                            break;
                        default:
                            throw "unrecognized mouse wheel event: " + e.type
                    }
                    return i
                },
                mouseX: 0,
                mouseY: 0,
                mouseMovementX: 0,
                mouseMovementY: 0,
                touches: {},
                lastTouches: {},
                calculateMouseEvent: function(e) {
                    var i, n, t, r, _, o, a, l, u, s, c, f;
                    if (Browser.pointerLock) "mousemove" != e.type && "mozMovementX" in e ? Browser.mouseMovementX = Browser.mouseMovementY = 0 : (Browser.mouseMovementX = Browser.getMovementX(e), Browser.mouseMovementY = Browser.getMovementY(e)), "undefined" != typeof SDL ? (Browser.mouseX = SDL.mouseX + Browser.mouseMovementX, Browser.mouseY = SDL.mouseY + Browser.mouseMovementY) : (Browser.mouseX += Browser.mouseMovementX, Browser.mouseY += Browser.mouseMovementY);
                    else {
                        if (i = Module["canvas"].getBoundingClientRect(), n = Module["canvas"].width, t = Module["canvas"].height, r = "undefined" != typeof window.scrollX ? window.scrollX : window.pageXOffset, _ = "undefined" != typeof window.scrollY ? window.scrollY : window.pageYOffset, "touchstart" === e.type || "touchend" === e.type || "touchmove" === e.type) {
                            if (o = e.touch, undefined === o) return;
                            return a = o.pageX - (r + i.left), l = o.pageY - (_ + i.top), a *= n / i.width, l *= t / i.height, u = {
                                x: a,
                                y: l
                            }, "touchstart" === e.type ? (Browser.lastTouches[o.identifier] = u, Browser.touches[o.identifier] = u) : ("touchend" === e.type || "touchmove" === e.type) && (s = Browser.touches[o.identifier], s || (s = u), Browser.lastTouches[o.identifier] = s, Browser.touches[o.identifier] = u), undefined
                        }
                        c = e.pageX - (r + i.left), f = e.pageY - (_ + i.top), c *= n / i.width, f *= t / i.height, Browser.mouseMovementX = c - Browser.mouseX, Browser.mouseMovementY = f - Browser.mouseY, Browser.mouseX = c, Browser.mouseY = f
                    }
                },
                asyncLoad: function(e, i, n, t) {
                    var r = t ? "" : getUniqueRunDependency("al " + e);
                    Module["readAsync"](e, function(n) {
                        assert(n, 'Loading data file "' + e + '" failed (no arrayBuffer).'), i(new Uint8Array(n)), r && removeRunDependency(r)
                    }, function(i) {
                        if (!n) throw 'Loading data file "' + e + '" failed.';
                        n()
                    }), r && addRunDependency(r)
                },
                resizeListeners: [],
                updateResizeListeners: function() {
                    var e = Module["canvas"];
                    Browser.resizeListeners.forEach(function(i) {
                        i(e.width, e.height)
                    })
                },
                setCanvasSize: function(e, i, n) {
                    var t = Module["canvas"];
                    Browser.updateCanvasDimensions(t, e, i), n || Browser.updateResizeListeners()
                },
                windowedWidth: 0,
                windowedHeight: 0,
                setFullscreenCanvasSize: function() {
                    if ("undefined" != typeof SDL) {
                        var e = HEAPU32[SDL.screen >> 2];
                        e = 8388608 | e, HEAP32[SDL.screen >> 2] = e
                    }
                    Browser.updateCanvasDimensions(Module["canvas"]), Browser.updateResizeListeners()
                },
                setWindowedCanvasSize: function() {
                    if ("undefined" != typeof SDL) {
                        var e = HEAPU32[SDL.screen >> 2];
                        e &= ~8388608, HEAP32[SDL.screen >> 2] = e
                    }
                    Browser.updateCanvasDimensions(Module["canvas"]), Browser.updateResizeListeners()
                },
                updateCanvasDimensions: function(e, i, n) {
                    var t, r, _;
                    i && n ? (e.widthNative = i, e.heightNative = n) : (i = e.widthNative, n = e.heightNative), t = i, r = n, Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0 && (t / r < Module["forcedAspectRatio"] ? t = Math.round(r * Module["forcedAspectRatio"]) : r = Math.round(t / Module["forcedAspectRatio"])), (document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === e.parentNode && "undefined" != typeof screen && (_ = Math.min(screen.width / t, screen.height / r), t = Math.round(t * _), r = Math.round(r * _)), Browser.resizeCanvas ? (e.width != t && (e.width = t), e.height != r && (e.height = r), "undefined" != typeof e.style && (e.style.removeProperty("width"), e.style.removeProperty("height"))) : (e.width != i && (e.width = i), e.height != n && (e.height = n), "undefined" != typeof e.style && (t != i || r != n ? (e.style.setProperty("width", t + "px", "important"), e.style.setProperty("height", r + "px", "important")) : (e.style.removeProperty("width"), e.style.removeProperty("height"))))
                },
                wgetRequests: {},
                nextWgetRequestHandle: 0,
                getNextWgetRequestHandle: function() {
                    var e = Browser.nextWgetRequestHandle;
                    return Browser.nextWgetRequestHandle++, e
                }
            }, JSEvents = {
                keyEvent: 0,
                mouseEvent: 0,
                wheelEvent: 0,
                uiEvent: 0,
                focusEvent: 0,
                deviceOrientationEvent: 0,
                deviceMotionEvent: 0,
                fullscreenChangeEvent: 0,
                pointerlockChangeEvent: 0,
                visibilityChangeEvent: 0,
                touchEvent: 0,
                lastGamepadState: null,
                lastGamepadStateFrame: null,
                numGamepadsConnected: 0,
                previousFullscreenElement: null,
                previousScreenX: null,
                previousScreenY: null,
                removeEventListenersRegistered: !1,
                _onGamepadConnected: function() {
                    ++JSEvents.numGamepadsConnected
                },
                _onGamepadDisconnected: function() {
                    --JSEvents.numGamepadsConnected
                },
                staticInit: function() {
                    if ("undefined" != typeof window) {
                        window.addEventListener("gamepadconnected", JSEvents._onGamepadConnected), window.addEventListener("gamepaddisconnected", JSEvents._onGamepadDisconnected);
                        var e = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : null;
                        e && (JSEvents.numGamepadsConnected = e.length)
                    }
                },
                removeAllEventListeners: function() {
                    for (var e = JSEvents.eventHandlers.length - 1; e >= 0; --e) JSEvents._removeHandler(e);
                    JSEvents.eventHandlers = [], JSEvents.deferredCalls = [], window.removeEventListener("gamepadconnected", JSEvents._onGamepadConnected), window.removeEventListener("gamepaddisconnected", JSEvents._onGamepadDisconnected)
                },
                registerRemoveEventListeners: function() {
                    JSEvents.removeEventListenersRegistered || (__ATEXIT__.push(JSEvents.removeAllEventListeners), JSEvents.removeEventListenersRegistered = !0)
                },
                findEventTarget: function(e) {
                    try {
                        return e ? ("number" == typeof e && (e = Pointer_stringify(e)), "#window" === e ? window : "#document" === e ? document : "#screen" === e ? window.screen : "#canvas" === e ? Module["canvas"] : "string" == typeof e ? document.getElementById(e) : e) : window
                    } catch (i) {
                        return null
                    }
                },
                findCanvasEventTarget: function(e) {
                    return "number" == typeof e && (e = Pointer_stringify(e)), e && "#canvas" !== e ? "undefined" != typeof GL && GL.offscreenCanvases[e] ? GL.offscreenCanvases[e] : JSEvents.findEventTarget(e) : "undefined" != typeof GL && GL.offscreenCanvases["canvas"] ? GL.offscreenCanvases["canvas"] : Module["canvas"]
                },
                deferredCalls: [],
                deferCall: function(e, i, n) {
                    function t(e, i) {
                        if (e.length != i.length) return !1;
                        for (var n in e)
                            if (e[n] != i[n]) return !1;
                        return !0
                    }
                    var r, _;
                    for (r in JSEvents.deferredCalls)
                        if (_ = JSEvents.deferredCalls[r], _.targetFunction == e && t(_.argsList, n)) return;
                    JSEvents.deferredCalls.push({
                        targetFunction: e,
                        precedence: i,
                        argsList: n
                    }), JSEvents.deferredCalls.sort(function(e, i) {
                        return e.precedence < i.precedence
                    })
                },
                removeDeferredCalls: function(e) {
                    for (var i = 0; i < JSEvents.deferredCalls.length; ++i) JSEvents.deferredCalls[i].targetFunction == e && (JSEvents.deferredCalls.splice(i, 1),
                        --i)
                },
                canPerformEventHandlerRequests: function() {
                    return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls
                },
                runDeferredCalls: function() {
                    var e, i;
                    if (JSEvents.canPerformEventHandlerRequests())
                        for (e = 0; e < JSEvents.deferredCalls.length; ++e) i = JSEvents.deferredCalls[e], JSEvents.deferredCalls.splice(e, 1), --e, i.targetFunction.apply(this, i.argsList)
                },
                inEventHandler: 0,
                currentEventHandler: null,
                eventHandlers: [],
                isInternetExplorer: function() {
                    return navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0
                },
                removeAllHandlersOnTarget: function(e, i) {
                    for (var n = 0; n < JSEvents.eventHandlers.length; ++n) JSEvents.eventHandlers[n].target != e || i && i != JSEvents.eventHandlers[n].eventTypeString || JSEvents._removeHandler(n--)
                },
                _removeHandler: function(e) {
                    var i = JSEvents.eventHandlers[e];
                    i.target.removeEventListener(i.eventTypeString, i.eventListenerFunc, i.useCapture), JSEvents.eventHandlers.splice(e, 1)
                },
                registerOrRemoveHandler: function(e) {
                    var i, n = function t(i) {
                        ++JSEvents.inEventHandler, JSEvents.currentEventHandler = e, JSEvents.runDeferredCalls(), e.handlerFunc(i), JSEvents.runDeferredCalls(), --JSEvents.inEventHandler
                    };
                    if (e.callbackfunc) e.eventListenerFunc = n, e.target.addEventListener(e.eventTypeString, n, e.useCapture), JSEvents.eventHandlers.push(e), JSEvents.registerRemoveEventListeners();
                    else
                        for (i = 0; i < JSEvents.eventHandlers.length; ++i) JSEvents.eventHandlers[i].target == e.target && JSEvents.eventHandlers[i].eventTypeString == e.eventTypeString && JSEvents._removeHandler(i--)
                },
                registerKeyEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.keyEvent || (JSEvents.keyEvent = _malloc(164)), a = function(e) {
                        var n = e || window.event,
                            _ = JSEvents.keyEvent;
                        stringToUTF8(n.key ? n.key : "", _ + 0, 32), stringToUTF8(n.code ? n.code : "", _ + 32, 32), HEAP32[_ + 64 >> 2] = n.location, HEAP32[_ + 68 >> 2] = n.ctrlKey, HEAP32[_ + 72 >> 2] = n.shiftKey, HEAP32[_ + 76 >> 2] = n.altKey, HEAP32[_ + 80 >> 2] = n.metaKey, HEAP32[_ + 84 >> 2] = n.repeat, stringToUTF8(n.locale ? n.locale : "", _ + 88, 32), stringToUTF8(n["char"] ? n["char"] : "", _ + 120, 32), HEAP32[_ + 152 >> 2] = n.charCode, HEAP32[_ + 156 >> 2] = n.keyCode, HEAP32[_ + 160 >> 2] = n.which, Module["dynCall_iiii"](t, r, _, i) && n.preventDefault()
                    }, l = {
                        target: JSEvents.findEventTarget(e),
                        allowsDeferredCalls: JSEvents.isInternetExplorer() ? !1 : !0,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                getBoundingClientRectOrZeros: function(e) {
                    return e.getBoundingClientRect ? e.getBoundingClientRect() : {
                        left: 0,
                        top: 0
                    }
                },
                fillMouseEventData: function(e, i, n) {
                    var t;
                    HEAPF64[e >> 3] = JSEvents.tick(), HEAP32[e + 8 >> 2] = i.screenX, HEAP32[e + 12 >> 2] = i.screenY, HEAP32[e + 16 >> 2] = i.clientX, HEAP32[e + 20 >> 2] = i.clientY, HEAP32[e + 24 >> 2] = i.ctrlKey, HEAP32[e + 28 >> 2] = i.shiftKey, HEAP32[e + 32 >> 2] = i.altKey, HEAP32[e + 36 >> 2] = i.metaKey, HEAP16[e + 40 >> 1] = i.button, HEAP16[e + 42 >> 1] = i.buttons, HEAP32[e + 44 >> 2] = i["movementX"] || i["mozMovementX"] || i["webkitMovementX"] || i.screenX - JSEvents.previousScreenX, HEAP32[e + 48 >> 2] = i["movementY"] || i["mozMovementY"] || i["webkitMovementY"] || i.screenY - JSEvents.previousScreenY, Module["canvas"] ? (t = Module["canvas"].getBoundingClientRect(), HEAP32[e + 60 >> 2] = i.clientX - t.left, HEAP32[e + 64 >> 2] = i.clientY - t.top) : (HEAP32[e + 60 >> 2] = 0, HEAP32[e + 64 >> 2] = 0), n ? (t = JSEvents.getBoundingClientRectOrZeros(n), HEAP32[e + 52 >> 2] = i.clientX - t.left, HEAP32[e + 56 >> 2] = i.clientY - t.top) : (HEAP32[e + 52 >> 2] = 0, HEAP32[e + 56 >> 2] = 0), "wheel" !== i.type && "mousewheel" !== i.type && (JSEvents.previousScreenX = i.screenX, JSEvents.previousScreenY = i.screenY)
                },
                registerMouseEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.mouseEvent || (JSEvents.mouseEvent = _malloc(72)), e = JSEvents.findEventTarget(e), a = function(n) {
                        var _ = n || window.event;
                        JSEvents.fillMouseEventData(JSEvents.mouseEvent, _, e), Module["dynCall_iiii"](t, r, JSEvents.mouseEvent, i) && _.preventDefault()
                    }, l = {
                        target: e,
                        allowsDeferredCalls: "mousemove" != _ && "mouseenter" != _ && "mouseleave" != _,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.isInternetExplorer() && "mousedown" == _ && (l.allowsDeferredCalls = !1), JSEvents.registerOrRemoveHandler(l)
                },
                registerWheelEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l, u;
                    JSEvents.wheelEvent || (JSEvents.wheelEvent = _malloc(104)), e = JSEvents.findEventTarget(e), a = function(n) {
                        var _ = n || window.event,
                            o = JSEvents.wheelEvent;
                        JSEvents.fillMouseEventData(o, _, e), HEAPF64[o + 72 >> 3] = _["deltaX"], HEAPF64[o + 80 >> 3] = _["deltaY"], HEAPF64[o + 88 >> 3] = _["deltaZ"], HEAP32[o + 96 >> 2] = _["deltaMode"], Module["dynCall_iiii"](t, r, o, i) && _.preventDefault()
                    }, l = function(n) {
                        var _, o = n || window.event;
                        JSEvents.fillMouseEventData(JSEvents.wheelEvent, o, e), HEAPF64[JSEvents.wheelEvent + 72 >> 3] = o["wheelDeltaX"] || 0, HEAPF64[JSEvents.wheelEvent + 80 >> 3] = -(o["wheelDeltaY"] ? o["wheelDeltaY"] : o["wheelDelta"]), HEAPF64[JSEvents.wheelEvent + 88 >> 3] = 0, HEAP32[JSEvents.wheelEvent + 96 >> 2] = 0, _ = Module["dynCall_iiii"](t, r, JSEvents.wheelEvent, i), _ && o.preventDefault()
                    }, u = {
                        target: e,
                        allowsDeferredCalls: !0,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: "wheel" == _ ? a : l,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(u)
                },
                pageScrollPos: function() {
                    return window.pageXOffset > 0 || window.pageYOffset > 0 ? [window.pageXOffset, window.pageYOffset] : "undefined" != typeof document.documentElement.scrollLeft || "undefined" != typeof document.documentElement.scrollTop ? [document.documentElement.scrollLeft, document.documentElement.scrollTop] : [0 | document.body.scrollLeft, 0 | document.body.scrollTop]
                },
                registerUiEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.uiEvent || (JSEvents.uiEvent = _malloc(36)), e = "scroll" != _ || e ? JSEvents.findEventTarget(e) : document, a = function(n) {
                        var _, o, a = n || window.event;
                        a.target == e && (_ = JSEvents.pageScrollPos(), o = JSEvents.uiEvent, HEAP32[o >> 2] = a.detail, HEAP32[o + 4 >> 2] = document.body.clientWidth, HEAP32[o + 8 >> 2] = document.body.clientHeight, HEAP32[o + 12 >> 2] = window.innerWidth, HEAP32[o + 16 >> 2] = window.innerHeight, HEAP32[o + 20 >> 2] = window.outerWidth, HEAP32[o + 24 >> 2] = window.outerHeight, HEAP32[o + 28 >> 2] = _[0], HEAP32[o + 32 >> 2] = _[1], Module["dynCall_iiii"](t, r, o, i) && a.preventDefault())
                    }, l = {
                        target: e,
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                getNodeNameForTarget: function(e) {
                    return e ? e == window ? "#window" : e == window.screen ? "#screen" : e && e.nodeName ? e.nodeName : "" : ""
                },
                registerFocusEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.focusEvent || (JSEvents.focusEvent = _malloc(256)), a = function(e) {
                        var n = e || window.event,
                            _ = JSEvents.getNodeNameForTarget(n.target),
                            o = n.target.id ? n.target.id : "",
                            a = JSEvents.focusEvent;
                        stringToUTF8(_, a + 0, 128), stringToUTF8(o, a + 128, 128), Module["dynCall_iiii"](t, r, a, i) && n.preventDefault()
                    }, l = {
                        target: JSEvents.findEventTarget(e),
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                tick: function() {
                    return window["performance"] && window["performance"]["now"] ? window["performance"]["now"]() : Date.now()
                },
                fillDeviceOrientationEventData: function(e, i, n) {
                    HEAPF64[e >> 3] = JSEvents.tick(), HEAPF64[e + 8 >> 3] = i.alpha, HEAPF64[e + 16 >> 3] = i.beta, HEAPF64[e + 24 >> 3] = i.gamma, HEAP32[e + 32 >> 2] = i.absolute
                },
                registerDeviceOrientationEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.deviceOrientationEvent || (JSEvents.deviceOrientationEvent = _malloc(40)), a = function(n) {
                        var _ = n || window.event;
                        JSEvents.fillDeviceOrientationEventData(JSEvents.deviceOrientationEvent, _, e), Module["dynCall_iiii"](t, r, JSEvents.deviceOrientationEvent, i) && _.preventDefault()
                    }, l = {
                        target: JSEvents.findEventTarget(e),
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                fillDeviceMotionEventData: function(e, i, n) {
                    HEAPF64[e >> 3] = JSEvents.tick(), HEAPF64[e + 8 >> 3] = i.acceleration.x, HEAPF64[e + 16 >> 3] = i.acceleration.y, HEAPF64[e + 24 >> 3] = i.acceleration.z, HEAPF64[e + 32 >> 3] = i.accelerationIncludingGravity.x, HEAPF64[e + 40 >> 3] = i.accelerationIncludingGravity.y, HEAPF64[e + 48 >> 3] = i.accelerationIncludingGravity.z, HEAPF64[e + 56 >> 3] = i.rotationRate.alpha, HEAPF64[e + 64 >> 3] = i.rotationRate.beta, HEAPF64[e + 72 >> 3] = i.rotationRate.gamma
                },
                registerDeviceMotionEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.deviceMotionEvent || (JSEvents.deviceMotionEvent = _malloc(80)), a = function(n) {
                        var _ = n || window.event;
                        JSEvents.fillDeviceMotionEventData(JSEvents.deviceMotionEvent, _, e), Module["dynCall_iiii"](t, r, JSEvents.deviceMotionEvent, i) && _.preventDefault()
                    }, l = {
                        target: JSEvents.findEventTarget(e),
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                screenOrientation: function() {
                    return window.screen ? window.screen.orientation || window.screen.mozOrientation || window.screen.webkitOrientation || window.screen.msOrientation : undefined
                },
                fillOrientationChangeEventData: function(e, i) {
                    var n = ["portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"],
                        t = ["portrait", "portrait", "landscape", "landscape"],
                        r = JSEvents.screenOrientation(),
                        _ = n.indexOf(r);
                    _ == -1 && (_ = t.indexOf(r)), HEAP32[e >> 2] = 1 << _, HEAP32[e + 4 >> 2] = window.orientation
                },
                registerOrientationChangeEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.orientationChangeEvent || (JSEvents.orientationChangeEvent = _malloc(8)), e = e ? JSEvents.findEventTarget(e) : window.screen, a = function(e) {
                        var n = e || window.event,
                            _ = JSEvents.orientationChangeEvent;
                        JSEvents.fillOrientationChangeEventData(_, n), Module["dynCall_iiii"](t, r, _, i) && n.preventDefault()
                    }, "orientationchange" == _ && undefined !== window.screen.mozOrientation && (_ = "mozorientationchange"), l = {
                        target: e,
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                fullscreenEnabled: function() {
                    return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled
                },
                fillFullscreenChangeEventData: function(e, i) {
                    var n, t, r, _ = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement,
                        o = !!_;
                    HEAP32[e >> 2] = o, HEAP32[e + 4 >> 2] = JSEvents.fullscreenEnabled(), n = o ? _ : JSEvents.previousFullscreenElement, t = JSEvents.getNodeNameForTarget(n), r = n && n.id ? n.id : "", stringToUTF8(t, e + 8, 128), stringToUTF8(r, e + 136, 128), HEAP32[e + 264 >> 2] = n ? n.clientWidth : 0, HEAP32[e + 268 >> 2] = n ? n.clientHeight : 0, HEAP32[e + 272 >> 2] = screen.width, HEAP32[e + 276 >> 2] = screen.height, o && (JSEvents.previousFullscreenElement = _)
                },
                registerFullscreenChangeEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.fullscreenChangeEvent || (JSEvents.fullscreenChangeEvent = _malloc(280)), e = e ? JSEvents.findEventTarget(e) : document, a = function(e) {
                        var n = e || window.event,
                            _ = JSEvents.fullscreenChangeEvent;
                        JSEvents.fillFullscreenChangeEventData(_, n), Module["dynCall_iiii"](t, r, _, i) && n.preventDefault()
                    }, l = {
                        target: e,
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                resizeCanvasForFullscreen: function(e, i) {
                    var n, t, r, _, o, a = __registerRestoreOldStyle(e),
                        l = i.softFullscreen ? window.innerWidth : screen.width,
                        u = i.softFullscreen ? window.innerHeight : screen.height,
                        s = e.getBoundingClientRect(),
                        c = s.right - s.left,
                        f = s.bottom - s.top,
                        d = emscripten_get_canvas_element_size_js(e.id),
                        p = d[0],
                        m = d[1];
                    return 3 == i.scaleMode ? (__setLetterbox(e, (u - f) / 2, (l - c) / 2), l = c, u = f) : 2 == i.scaleMode && (p * u > l * m ? (n = m * l / p, __setLetterbox(e, (u - n) / 2, 0), u = n) : (t = p * u / m, __setLetterbox(e, 0, (l - t) / 2), l = t)), e.style.backgroundColor || (e.style.backgroundColor = "black"), document.body.style.backgroundColor || (document.body.style.backgroundColor = "black"), e.style.width = l + "px", e.style.height = u + "px", 1 == i.filteringMode && (e.style.imageRendering = "optimizeSpeed", e.style.imageRendering = "-moz-crisp-edges", e.style.imageRendering = "-o-crisp-edges", e.style.imageRendering = "-webkit-optimize-contrast", e.style.imageRendering = "optimize-contrast", e.style.imageRendering = "crisp-edges", e.style.imageRendering = "pixelated"), r = 2 == i.canvasResolutionScaleMode ? window.devicePixelRatio : 1, 0 != i.canvasResolutionScaleMode && (_ = l * r | 0, o = u * r | 0, e.controlTransferredOffscreen ? emscripten_set_canvas_element_size_js(e.id, _, o) : (e.width = _, e.height = o), e.GLctxObject && e.GLctxObject.GLctx.viewport(0, 0, _, o)), a
                },
                requestFullscreen: function(e, i) {
                    if ((0 != i.scaleMode || 0 != i.canvasResolutionScaleMode) && JSEvents.resizeCanvasForFullscreen(e, i), e.requestFullscreen) e.requestFullscreen();
                    else if (e.msRequestFullscreen) e.msRequestFullscreen();
                    else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
                    else if (e.mozRequestFullscreen) e.mozRequestFullscreen();
                    else {
                        if (!e.webkitRequestFullscreen) return "undefined" == typeof JSEvents.fullscreenEnabled() ? -1 : -3;
                        e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
                    }
                    return i.canvasResizedCallback && Module["dynCall_iiii"](i.canvasResizedCallback, 37, 0, i.canvasResizedCallbackUserData), 0
                },
                fillPointerlockChangeEventData: function(e, i) {
                    var n, t, r = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement,
                        _ = !!r;
                    HEAP32[e >> 2] = _, n = JSEvents.getNodeNameForTarget(r), t = r && r.id ? r.id : "", stringToUTF8(n, e + 4, 128), stringToUTF8(t, e + 132, 128)
                },
                registerPointerlockChangeEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.pointerlockChangeEvent || (JSEvents.pointerlockChangeEvent = _malloc(260)), e = e ? JSEvents.findEventTarget(e) : document, a = function(e) {
                        var n = e || window.event,
                            _ = JSEvents.pointerlockChangeEvent;
                        JSEvents.fillPointerlockChangeEventData(_, n), Module["dynCall_iiii"](t, r, _, i) && n.preventDefault()
                    }, l = {
                        target: e,
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                registerPointerlockErrorEventCallback: function(e, i, n, t, r, _) {
                    var o, a;
                    e = e ? JSEvents.findEventTarget(e) : document, o = function(e) {
                        var n = e || window.event;
                        Module["dynCall_iiii"](t, r, 0, i) && n.preventDefault()
                    }, a = {
                        target: e,
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: o,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(a)
                },
                requestPointerLock: function(e) {
                    if (e.requestPointerLock) e.requestPointerLock();
                    else if (e.mozRequestPointerLock) e.mozRequestPointerLock();
                    else if (e.webkitRequestPointerLock) e.webkitRequestPointerLock();
                    else {
                        if (!e.msRequestPointerLock) return document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock || document.body.msRequestPointerLock ? -3 : -1;
                        e.msRequestPointerLock()
                    }
                    return 0
                },
                fillVisibilityChangeEventData: function(e, i) {
                    var n = ["hidden", "visible", "prerender", "unloaded"],
                        t = n.indexOf(document.visibilityState);
                    HEAP32[e >> 2] = document.hidden, HEAP32[e + 4 >> 2] = t
                },
                registerVisibilityChangeEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.visibilityChangeEvent || (JSEvents.visibilityChangeEvent = _malloc(8)), e = e ? JSEvents.findEventTarget(e) : document, a = function(e) {
                        var n = e || window.event,
                            _ = JSEvents.visibilityChangeEvent;
                        JSEvents.fillVisibilityChangeEventData(_, n), Module["dynCall_iiii"](t, r, _, i) && n.preventDefault()
                    }, l = {
                        target: e,
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                registerTouchEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.touchEvent || (JSEvents.touchEvent = _malloc(1684)), e = JSEvents.findEventTarget(e), a = function(n) {
                        var _, o, a, l, u, s, c, f, d = n || window.event,
                            p = {};
                        for (_ = 0; _ < d.touches.length; ++_) o = d.touches[_], p[o.identifier] = o;
                        for (_ = 0; _ < d.changedTouches.length; ++_) o = d.changedTouches[_], p[o.identifier] = o, o.changed = !0;
                        for (_ = 0; _ < d.targetTouches.length; ++_) o = d.targetTouches[_], p[o.identifier].onTarget = !0;
                        a = JSEvents.touchEvent, l = a, HEAP32[l + 4 >> 2] = d.ctrlKey, HEAP32[l + 8 >> 2] = d.shiftKey, HEAP32[l + 12 >> 2] = d.altKey, HEAP32[l + 16 >> 2] = d.metaKey, l += 20, u = Module["canvas"] ? Module["canvas"].getBoundingClientRect() : undefined, s = JSEvents.getBoundingClientRectOrZeros(e), c = 0;
                        for (_ in p)
                            if (f = p[_], HEAP32[l >> 2] = f.identifier, HEAP32[l + 4 >> 2] = f.screenX, HEAP32[l + 8 >> 2] = f.screenY, HEAP32[l + 12 >> 2] = f.clientX, HEAP32[l + 16 >> 2] = f.clientY, HEAP32[l + 20 >> 2] = f.pageX, HEAP32[l + 24 >> 2] = f.pageY, HEAP32[l + 28 >> 2] = f.changed, HEAP32[l + 32 >> 2] = f.onTarget, u ? (HEAP32[l + 44 >> 2] = f.clientX - u.left, HEAP32[l + 48 >> 2] = f.clientY - u.top) : (HEAP32[l + 44 >> 2] = 0, HEAP32[l + 48 >> 2] = 0), HEAP32[l + 36 >> 2] = f.clientX - s.left, HEAP32[l + 40 >> 2] = f.clientY - s.top, l += 52, ++c >= 32) break;
                        HEAP32[a >> 2] = c, Module["dynCall_iiii"](t, r, a, i) && d.preventDefault()
                    }, l = {
                        target: e,
                        allowsDeferredCalls: "touchstart" == _ || "touchend" == _,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                fillGamepadEventData: function(e, i) {
                    var n;
                    for (HEAPF64[e >> 3] = i.timestamp, n = 0; n < i.axes.length; ++n) HEAPF64[e + 8 * n + 16 >> 3] = i.axes[n];
                    for (n = 0; n < i.buttons.length; ++n) "object" == typeof i.buttons[n] ? HEAPF64[e + 8 * n + 528 >> 3] = i.buttons[n].value : HEAPF64[e + 8 * n + 528 >> 3] = i.buttons[n];
                    for (n = 0; n < i.buttons.length; ++n) "object" == typeof i.buttons[n] ? HEAP32[e + 4 * n + 1040 >> 2] = i.buttons[n].pressed : HEAP32[e + 4 * n + 1040 >> 2] = 1 == i.buttons[n];
                    HEAP32[e + 1296 >> 2] = i.connected, HEAP32[e + 1300 >> 2] = i.index, HEAP32[e + 8 >> 2] = i.axes.length, HEAP32[e + 12 >> 2] = i.buttons.length, stringToUTF8(i.id, e + 1304, 64), stringToUTF8(i.mapping, e + 1368, 64)
                },
                registerGamepadEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.gamepadEvent || (JSEvents.gamepadEvent = _malloc(1432)), a = function(e) {
                        var n = e || window.event,
                            _ = JSEvents.gamepadEvent;
                        JSEvents.fillGamepadEventData(_, n.gamepad), Module["dynCall_iiii"](t, r, _, i) && n.preventDefault()
                    }, l = {
                        target: JSEvents.findEventTarget(e),
                        allowsDeferredCalls: !0,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                registerBeforeUnloadEventCallback: function(e, i, n, t, r, _) {
                    var o = function(e) {
                            var n = e || window.event,
                                _ = Module["dynCall_iiii"](t, r, 0, i);
                            return _ && (_ = Pointer_stringify(_)), _ ? (n.preventDefault(), n.returnValue = _, _) : undefined
                        },
                        a = {
                            target: JSEvents.findEventTarget(e),
                            allowsDeferredCalls: !1,
                            eventTypeString: _,
                            callbackfunc: t,
                            handlerFunc: o,
                            useCapture: n
                        };
                    JSEvents.registerOrRemoveHandler(a)
                },
                battery: function() {
                    return navigator.battery || navigator.mozBattery || navigator.webkitBattery
                },
                fillBatteryEventData: function(e, i) {
                    HEAPF64[e >> 3] = i.chargingTime, HEAPF64[e + 8 >> 3] = i.dischargingTime, HEAPF64[e + 16 >> 3] = i.level, HEAP32[e + 24 >> 2] = i.charging
                },
                registerBatteryEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    JSEvents.batteryEvent || (JSEvents.batteryEvent = _malloc(32)), a = function(e) {
                        var n = e || window.event,
                            _ = JSEvents.batteryEvent;
                        JSEvents.fillBatteryEventData(_, JSEvents.battery()), Module["dynCall_iiii"](t, r, _, i) && n.preventDefault()
                    }, l = {
                        target: JSEvents.findEventTarget(e),
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                },
                registerWebGlEventCallback: function(e, i, n, t, r, _, o) {
                    var a, l;
                    e || (e = Module["canvas"]), a = function(e) {
                        var n = e || window.event;
                        Module["dynCall_iiii"](t, r, 0, i) && n.preventDefault()
                    }, l = {
                        target: JSEvents.findEventTarget(e),
                        allowsDeferredCalls: !1,
                        eventTypeString: _,
                        callbackfunc: t,
                        handlerFunc: a,
                        useCapture: n
                    }, JSEvents.registerOrRemoveHandler(l)
                }
            }, __currentFullscreenStrategy = {}, GL = {
                counter: 1,
                lastError: 0,
                buffers: [],
                mappedBuffers: {},
                programs: [],
                framebuffers: [],
                renderbuffers: [],
                textures: [],
                uniforms: [],
                shaders: [],
                vaos: [],
                contexts: [],
                currentContext: null,
                offscreenCanvases: {},
                timerQueriesEXT: [],
                queries: [],
                samplers: [],
                transformFeedbacks: [],
                syncs: [],
                byteSizeByTypeRoot: 5120,
                byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
                programInfos: {},
                stringCache: {},
                stringiCache: {},
                tempFixedLengthArray: [],
                packAlignment: 4,
                unpackAlignment: 4,
                init: function() {
                    var e;
                    for (GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE), e = 0; e < GL.MINI_TEMP_BUFFER_SIZE; e++) GL.miniTempBufferViews[e] = GL.miniTempBuffer.subarray(0, e + 1);
                    for (e = 0; 32 > e; e++) GL.tempFixedLengthArray.push(new Array(e))
                },
                recordError: function u(e) {
                    GL.lastError || (GL.lastError = e)
                },
                getNewId: function(e) {
                    var i, n = GL.counter++;
                    for (i = e.length; n > i; i++) e[i] = null;
                    return n
                },
                MINI_TEMP_BUFFER_SIZE: 256,
                miniTempBuffer: null,
                miniTempBufferViews: [0],
                getSource: function(e, i, n, t) {
                    var r, _, o, a = "";
                    for (r = 0; i > r; ++r) t ? (o = HEAP32[t + 4 * r >> 2], _ = 0 > o ? Pointer_stringify(HEAP32[n + 4 * r >> 2]) : Pointer_stringify(HEAP32[n + 4 * r >> 2], o)) : _ = Pointer_stringify(HEAP32[n + 4 * r >> 2]), a += _;
                    return a
                },
                createContext: function(e, i) {
                    function n(e) {
                        r = e.statusMessage || r
                    }
                    var t, r, _;
                    "undefined" == typeof i["majorVersion"] && "undefined" == typeof i["minorVersion"] && ("undefined" != typeof WebGL2RenderingContext ? i["majorVersion"] = 2 : i["majorVersion"] = 1, i["minorVersion"] = 0), r = "?";
                    try {
                        e.addEventListener("webglcontextcreationerror", n, !1);
                        try {
                            if (1 == i["majorVersion"] && 0 == i["minorVersion"]) t = e.getContext("webgl", i) || e.getContext("experimental-webgl", i);
                            else {
                                if (2 != i["majorVersion"] || 0 != i["minorVersion"]) throw "Unsupported WebGL context version " + majorVersion + "." + minorVersion + "!";
                                t = e.getContext("webgl2", i)
                            }
                        } finally {
                            e.removeEventListener("webglcontextcreationerror", n, !1)
                        }
                        if (!t) throw ":("
                    } catch (o) {
                        return out("Could not create canvas: " + [r, o, JSON.stringify(i)]), 0
                    }
                    return t ? (_ = GL.registerContext(t, i), _) : 0
                },
                registerContext: function(e, i) {
                    function n() {
                        var e = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
                        return e ? parseInt(e[2], 10) : !1
                    }
                    var t, r = _malloc(8);
                    return HEAP32[r >> 2] = i["explicitSwapControl"], t = {
                        handle: r,
                        attributes: i,
                        version: i["majorVersion"],
                        GLctx: e
                    }, t.supportsWebGL2EntryPoints = t.version >= 2 && (n() === !1 || n() >= 58), e.canvas && (e.canvas.GLctxObject = t), GL.contexts[r] = t, ("undefined" == typeof i["enableExtensionsByDefault"] || i["enableExtensionsByDefault"]) && GL.initExtensions(t), i["renderViaOffscreenBackBuffer"] ? 0 : r
                },
                makeContextCurrent: function(e) {
                    if (!e) return GLctx = Module.ctx = GL.currentContext = null, !0;
                    var i = GL.contexts[e];
                    return i ? (GLctx = Module.ctx = i.GLctx, GL.currentContext = i, !0) : !1
                },
                getContext: function(e) {
                    return GL.contexts[e]
                },
                deleteContext: function(e) {
                    e && (GL.currentContext === GL.contexts[e] && (GL.currentContext = null), "object" == typeof JSEvents && JSEvents.removeAllHandlersOnTarget(GL.contexts[e].GLctx.canvas), GL.contexts[e] && GL.contexts[e].GLctx.canvas && (GL.contexts[e].GLctx.canvas.GLctxObject = undefined), _free(GL.contexts[e]), GL.contexts[e] = null)
                },
                initExtensions: function(e) {
                    var i, n, t, r, _, o;
                    e || (e = GL.currentContext), e.initExtensionsDone || (e.initExtensionsDone = !0, i = e.GLctx, e.maxVertexAttribs = i.getParameter(i.MAX_VERTEX_ATTRIBS), e.version < 2 && (n = i.getExtension("ANGLE_instanced_arrays"), n && (i["vertexAttribDivisor"] = function(e, i) {
                        n["vertexAttribDivisorANGLE"](e, i)
                    }, i["drawArraysInstanced"] = function(e, i, t, r) {
                        n["drawArraysInstancedANGLE"](e, i, t, r)
                    }, i["drawElementsInstanced"] = function(e, i, t, r, _) {
                        n["drawElementsInstancedANGLE"](e, i, t, r, _)
                    }), t = i.getExtension("OES_vertex_array_object"), t && (i["createVertexArray"] = function() {
                        return t["createVertexArrayOES"]()
                    }, i["deleteVertexArray"] = function(e) {
                        t["deleteVertexArrayOES"](e)
                    }, i["bindVertexArray"] = function(e) {
                        t["bindVertexArrayOES"](e)
                    }, i["isVertexArray"] = function(e) {
                        return t["isVertexArrayOES"](e)
                    }), r = i.getExtension("WEBGL_draw_buffers"), r && (i["drawBuffers"] = function(e, i) {
                        r["drawBuffersWEBGL"](e, i)
                    })), i.disjointTimerQueryExt = i.getExtension("EXT_disjoint_timer_query"), _ = ["OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives", "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture", "OES_element_index_uint", "EXT_texture_filter_anisotropic", "EXT_frag_depth", "WEBGL_draw_buffers", "ANGLE_instanced_arrays", "OES_texture_float_linear", "OES_texture_half_float_linear", "EXT_blend_minmax", "EXT_shader_texture_lod", "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float", "EXT_sRGB", "WEBGL_compressed_texture_etc1", "EXT_disjoint_timer_query", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_astc", "EXT_color_buffer_float", "WEBGL_compressed_texture_s3tc_srgb", "EXT_disjoint_timer_query_webgl2"], o = i.getSupportedExtensions(), o && o.length > 0 && i.getSupportedExtensions().forEach(function(e) {
                        _.indexOf(e) != -1 && i.getExtension(e)
                    }))
                },
                populateUniformTable: function(e) {
                    var i, n, t, r, _, o, a, l, u, s, c, f = GL.programs[e];
                    for (GL.programInfos[e] = {
                            uniforms: {},
                            maxUniformLength: 0,
                            maxAttributeLength: -1,
                            maxUniformBlockNameLength: -1
                        }, i = GL.programInfos[e], n = i.uniforms, t = GLctx.getProgramParameter(f, GLctx.ACTIVE_UNIFORMS), r = 0; t > r; ++r)
                        if (_ = GLctx.getActiveUniform(f, r), o = _.name, i.maxUniformLength = Math.max(i.maxUniformLength, o.length + 1), o.indexOf("]", o.length - 1) !== -1 && (a = o.lastIndexOf("["), o = o.slice(0, a)), l = GLctx.getUniformLocation(f, o), null != l)
                            for (u = GL.getNewId(GL.uniforms), n[o] = [_.size, u], GL.uniforms[u] = l, s = 1; s < _.size; ++s) c = o + "[" + s + "]", l = GLctx.getUniformLocation(f, c), u = GL.getNewId(GL.uniforms), GL.uniforms[u] = l
                }
            }, ___tm_current = STATICTOP, STATICTOP += 48, ___tm_timezone = allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC), _llvm_ceil_f32 = Math_ceil, _llvm_ceil_f64 = Math_ceil, _llvm_fabs_f32 = Math_abs, _llvm_fabs_f64 = Math_abs, _llvm_floor_f32 = Math_floor, _llvm_floor_f64 = Math_floor, _llvm_pow_f64 = Math_pow, _llvm_sqrt_f32 = Math_sqrt, _llvm_trunc_f32 = Math_trunc, PTHREAD_SPECIFIC = {}, PTHREAD_SPECIFIC_NEXT_KEY = 1, __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], FS.staticInit(), __ATINIT__.unshift(function() {
                Module["noFSInit"] || FS.init.initialized || FS.init()
            }), __ATMAIN__.push(function() {
                FS.ignorePermissions = !1
            }), __ATEXIT__.push(function() {
                FS.quit()
            }), Module["FS_createPath"] = FS.createPath, Module["FS_createDataFile"] = FS.createDataFile, __ATINIT__.unshift(function() {
                TTY.init()
            }), __ATEXIT__.push(function() {
                TTY.shutdown()
            }), ENVIRONMENT_IS_NODE && (fs = require("fs"), NODEJS_PATH = require("path"), NODEFS.staticInit()), __ATINIT__.push(function() {
                SOCKFS.root = FS.mount(SOCKFS, {}, null)
            }), __ATINIT__.push(function() {
                PIPEFS.root = FS.mount(PIPEFS, {}, null)
            }), _emscripten_get_now = ENVIRONMENT_IS_NODE ? function s() {
                var e = process["hrtime"]();
                return 1e3 * e[0] + e[1] / 1e6
            } : "undefined" != typeof dateNow ? dateNow : "object" == typeof self && self["performance"] && "function" == typeof self["performance"]["now"] ? function() {
                return self["performance"]["now"]()
            } : "object" == typeof performance && "function" == typeof performance["now"] ? function() {
                return performance["now"]()
            } : Date.now, Module["requestFullScreen"] = function c(e, i, n) {
                err("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead."), Module["requestFullScreen"] = Module["requestFullscreen"], Browser.requestFullScreen(e, i, n)
            }, Module["requestFullscreen"] = function f(e, i, n) {
                Browser.requestFullscreen(e, i, n)
            }, Module["requestAnimationFrame"] = function d(e) {
                Browser.requestAnimationFrame(e)
            }, Module["setCanvasSize"] = function p(e, i, n) {
                Browser.setCanvasSize(e, i, n)
            }, Module["pauseMainLoop"] = function m() {
                Browser.mainLoop.pause()
            }, Module["resumeMainLoop"] = function v() {
                Browser.mainLoop.resume()
            }, Module["getUserMedia"] = function y() {
                Browser.getUserMedia()
            }, Module["createContext"] = function g(e, i, n, t) {
                return Browser.createContext(e, i, n, t)
            }, JSEvents.staticInit(), GL.init(), DYNAMICTOP_PTR = staticAlloc(4), STACK_BASE = STACKTOP = alignMemory(STATICTOP), STACK_MAX = STACK_BASE + TOTAL_STACK, DYNAMIC_BASE = alignMemory(STACK_MAX), HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE, staticSealed = !0, Module["wasmTableSize"] = 126009, Module["wasmMaxTableSize"] = 126009, Module.asmGlobalArg = {}, Module.asmLibraryArg = {
                abort: abort,
                assert: assert,
                enlargeMemory: enlargeMemory,
                getTotalMemory: getTotalMemory,
                abortOnCannotGrowMemory: abortOnCannotGrowMemory,
                invoke_dd: invoke_dd,
                invoke_ddd: invoke_ddd,
                invoke_ddddi: invoke_ddddi,
                invoke_dddi: invoke_dddi,
                invoke_ddi: invoke_ddi,
                invoke_ddii: invoke_ddii,
                invoke_ddiii: invoke_ddiii,
                invoke_dfi: invoke_dfi,
                invoke_di: invoke_di,
                invoke_diddi: invoke_diddi,
                invoke_didi: invoke_didi,
                invoke_dii: invoke_dii,
                invoke_diidi: invoke_diidi,
                invoke_diii: invoke_diii,
                invoke_diiii: invoke_diiii,
                invoke_dji: invoke_dji,
                invoke_f: invoke_f,
                invoke_fdi: invoke_fdi,
                invoke_ff: invoke_ff,
                invoke_fff: invoke_fff,
                invoke_ffffffi: invoke_ffffffi,
                invoke_fffffi: invoke_fffffi,
                invoke_ffffi: invoke_ffffi,
                invoke_ffffii: invoke_ffffii,
                invoke_fffi: invoke_fffi,
                invoke_fffifffi: invoke_fffifffi,
                invoke_fffifi: invoke_fffifi,
                invoke_ffi: invoke_ffi,
                invoke_ffii: invoke_ffii,
                invoke_fi: invoke_fi,
                invoke_fif: invoke_fif,
                invoke_fiff: invoke_fiff,
                invoke_fiffffii: invoke_fiffffii,
                invoke_fiffffiiiii: invoke_fiffffiiiii,
                invoke_fiffffiiiiii: invoke_fiffffiiiiii,
                invoke_fifffi: invoke_fifffi,
                invoke_fiffi: invoke_fiffi,
                invoke_fifi: invoke_fifi,
                invoke_fifii: invoke_fifii,
                invoke_fifiii: invoke_fifiii,
                invoke_fii: invoke_fii,
                invoke_fiif: invoke_fiif,
                invoke_fiifi: invoke_fiifi,
                invoke_fiifii: invoke_fiifii,
                invoke_fiii: invoke_fiii,
                invoke_fiiifi: invoke_fiiifi,
                invoke_fiiii: invoke_fiiii,
                invoke_fiiiif: invoke_fiiiif,
                invoke_fiiiiiifiifif: invoke_fiiiiiifiifif,
                invoke_fiiiiiifiiiif: invoke_fiiiiiifiiiif,
                invoke_fji: invoke_fji,
                invoke_i: invoke_i,
                invoke_idi: invoke_idi,
                invoke_idiii: invoke_idiii,
                invoke_iffffi: invoke_iffffi,
                invoke_ifffi: invoke_ifffi,
                invoke_ifffii: invoke_ifffii,
                invoke_ifffiii: invoke_ifffiii,
                invoke_iffi: invoke_iffi,
                invoke_ifi: invoke_ifi,
                invoke_ifii: invoke_ifii,
                invoke_ifiii: invoke_ifiii,
                invoke_ii: invoke_ii,
                invoke_iiddi: invoke_iiddi,
                invoke_iidi: invoke_iidi,
                invoke_iidii: invoke_iidii,
                invoke_iif: invoke_iif,
                invoke_iiff: invoke_iiff,
                invoke_iifff: invoke_iifff,
                invoke_iifffi: invoke_iifffi,
                invoke_iiffi: invoke_iiffi,
                invoke_iiffii: invoke_iiffii,
                invoke_iiffiii: invoke_iiffiii,
                invoke_iifi: invoke_iifi,
                invoke_iififiii: invoke_iififiii,
                invoke_iifii: invoke_iifii,
                invoke_iifiii: invoke_iifiii,
                invoke_iifiiii: invoke_iifiiii,
                invoke_iii: invoke_iii,
                invoke_iiidii: invoke_iiidii,
                invoke_iiif: invoke_iiif,
                invoke_iiifffffffi: invoke_iiifffffffi,
                invoke_iiiffffiii: invoke_iiiffffiii,
                invoke_iiifffi: invoke_iiifffi,
                invoke_iiifffii: invoke_iiifffii,
                invoke_iiiffi: invoke_iiiffi,
                invoke_iiiffii: invoke_iiiffii,
                invoke_iiiffiii: invoke_iiiffiii,
                invoke_iiifi: invoke_iiifi,
                invoke_iiifii: invoke_iiifii,
                invoke_iiifiii: invoke_iiifiii,
                invoke_iiifiiii: invoke_iiifiiii,
                invoke_iiii: invoke_iiii,
                invoke_iiiifffffi: invoke_iiiifffffi,
                invoke_iiiiffffiii: invoke_iiiiffffiii,
                invoke_iiiiffi: invoke_iiiiffi,
                invoke_iiiiffii: invoke_iiiiffii,
                invoke_iiiifi: invoke_iiiifi,
                invoke_iiiifii: invoke_iiiifii,
                invoke_iiiifiii: invoke_iiiifiii,
                invoke_iiiifiiii: invoke_iiiifiiii,
                invoke_iiiifiiiii: invoke_iiiifiiiii,
                invoke_iiiii: invoke_iiiii,
                invoke_iiiiiffii: invoke_iiiiiffii,
                invoke_iiiiifi: invoke_iiiiifi,
                invoke_iiiiifii: invoke_iiiiifii,
                invoke_iiiiifiii: invoke_iiiiifiii,
                invoke_iiiiifiiiif: invoke_iiiiifiiiif,
                invoke_iiiiifiiiiif: invoke_iiiiifiiiiif,
                invoke_iiiiii: invoke_iiiiii,
                invoke_iiiiiifffi: invoke_iiiiiifffi,
                invoke_iiiiiifffiiifiii: invoke_iiiiiifffiiifiii,
                invoke_iiiiiiffiiiiiiiiiffffiii: invoke_iiiiiiffiiiiiiiiiffffiii,
                invoke_iiiiiiffiiiiiiiiiffffiiii: invoke_iiiiiiffiiiiiiiiiffffiiii,
                invoke_iiiiiiffiiiiiiiiiiiiiii: invoke_iiiiiiffiiiiiiiiiiiiiii,
                invoke_iiiiiifiif: invoke_iiiiiifiif,
                invoke_iiiiiifiii: invoke_iiiiiifiii,
                invoke_iiiiiii: invoke_iiiiiii,
                invoke_iiiiiiifi: invoke_iiiiiiifi,
                invoke_iiiiiiifii: invoke_iiiiiiifii,
                invoke_iiiiiiifiif: invoke_iiiiiiifiif,
                invoke_iiiiiiii: invoke_iiiiiiii,
                invoke_iiiiiiiii: invoke_iiiiiiiii,
                invoke_iiiiiiiiii: invoke_iiiiiiiiii,
                invoke_iiiiiiiiiii: invoke_iiiiiiiiiii,
                invoke_iiiiiiiiiiii: invoke_iiiiiiiiiiii,
                invoke_iiiiiiiiiiiii: invoke_iiiiiiiiiiiii,
                invoke_iiiiiiiiiiiiii: invoke_iiiiiiiiiiiiii,
                invoke_iiiiiiijjiii: invoke_iiiiiiijjiii,
                invoke_iiiiiijjiii: invoke_iiiiiijjiii,
                invoke_iiiiij: invoke_iiiiij,
                invoke_iiiiiji: invoke_iiiiiji,
                invoke_iiiiijiiii: invoke_iiiiijiiii,
                invoke_iiiij: invoke_iiiij,
                invoke_iiiiji: invoke_iiiiji,
                invoke_iiiijii: invoke_iiiijii,
                invoke_iiiijjii: invoke_iiiijjii,
                invoke_iiiijjiiii: invoke_iiiijjiiii,
                invoke_iiij: invoke_iiij,
                invoke_iiiji: invoke_iiiji,
                invoke_iiijii: invoke_iiijii,
                invoke_iiijiii: invoke_iiijiii,
                invoke_iiijji: invoke_iiijji,
                invoke_iiijjii: invoke_iiijjii,
                invoke_iiijjiiii: invoke_iiijjiiii,
                invoke_iiijjjiii: invoke_iiijjjiii,
                invoke_iij: invoke_iij,
                invoke_iiji: invoke_iiji,
                invoke_iijii: invoke_iijii,
                invoke_iijiii: invoke_iijiii,
                invoke_iijiiii: invoke_iijiiii,
                invoke_iijiiiiiii: invoke_iijiiiiiii,
                invoke_iijji: invoke_iijji,
                invoke_iijjii: invoke_iijjii,
                invoke_iijjiii: invoke_iijjiii,
                invoke_iijjji: invoke_iijjji,
                invoke_iijjjii: invoke_iijjjii,
                invoke_ij: invoke_ij,
                invoke_iji: invoke_iji,
                invoke_ijiii: invoke_ijiii,
                invoke_ijj: invoke_ijj,
                invoke_ijji: invoke_ijji,
                invoke_j: invoke_j,
                invoke_jdi: invoke_jdi,
                invoke_jdii: invoke_jdii,
                invoke_jfi: invoke_jfi,
                invoke_ji: invoke_ji,
                invoke_jidi: invoke_jidi,
                invoke_jidii: invoke_jidii,
                invoke_jii: invoke_jii,
                invoke_jiii: invoke_jiii,
                invoke_jiiii: invoke_jiiii,
                invoke_jiiiii: invoke_jiiiii,
                invoke_jiiiiii: invoke_jiiiiii,
                invoke_jiiiiiiiiii: invoke_jiiiiiiiiii,
                invoke_jiiji: invoke_jiiji,
                invoke_jiijii: invoke_jiijii,
                invoke_jiji: invoke_jiji,
                invoke_jijii: invoke_jijii,
                invoke_jijiii: invoke_jijiii,
                invoke_jijj: invoke_jijj,
                invoke_jijji: invoke_jijji,
                invoke_jj: invoke_jj,
                invoke_jji: invoke_jji,
                invoke_jjii: invoke_jjii,
                invoke_jjjji: invoke_jjjji,
                invoke_v: invoke_v,
                invoke_vd: invoke_vd,
                invoke_vdii: invoke_vdii,
                invoke_vf: invoke_vf,
                invoke_vff: invoke_vff,
                invoke_vfff: invoke_vfff,
                invoke_vffff: invoke_vffff,
                invoke_vffffi: invoke_vffffi,
                invoke_vfffi: invoke_vfffi,
                invoke_vfi: invoke_vfi,
                invoke_vfif: invoke_vfif,
                invoke_vfifi: invoke_vfifi,
                invoke_vfii: invoke_vfii,
                invoke_vfiii: invoke_vfiii,
                invoke_vi: invoke_vi,
                invoke_vid: invoke_vid,
                invoke_vidd: invoke_vidd,
                invoke_viddi: invoke_viddi,
                invoke_vidi: invoke_vidi,
                invoke_vif: invoke_vif,
                invoke_viff: invoke_viff,
                invoke_vifff: invoke_vifff,
                invoke_viffff: invoke_viffff,
                invoke_viffffffi: invoke_viffffffi,
                invoke_viffffi: invoke_viffffi,
                invoke_viffffii: invoke_viffffii,
                invoke_viffffiii: invoke_viffffiii,
                invoke_viffffiiiii: invoke_viffffiiiii,
                invoke_vifffi: invoke_vifffi,
                invoke_vifffii: invoke_vifffii,
                invoke_viffi: invoke_viffi,
                invoke_viffii: invoke_viffii,
                invoke_viffiii: invoke_viffiii,
                invoke_vifi: invoke_vifi,
                invoke_vififi: invoke_vififi,
                invoke_vififififii: invoke_vififififii,
                invoke_vifii: invoke_vifii,
                invoke_vifiii: invoke_vifiii,
                invoke_vifiiii: invoke_vifiiii,
                invoke_vii: invoke_vii,
                invoke_viid: invoke_viid,
                invoke_viiddi: invoke_viiddi,
                invoke_viidi: invoke_viidi,
                invoke_viidii: invoke_viidii,
                invoke_viif: invoke_viif,
                invoke_viiff: invoke_viiff,
                invoke_viifff: invoke_viifff,
                invoke_viiffffffi: invoke_viiffffffi,
                invoke_viiffffi: invoke_viiffffi,
                invoke_viiffffii: invoke_viiffffii,
                invoke_viiffffiiiii: invoke_viiffffiiiii,
                invoke_viifffi: invoke_viifffi,
                invoke_viifffiiii: invoke_viifffiiii,
                invoke_viiffi: invoke_viiffi,
                invoke_viiffii: invoke_viiffii,
                invoke_viiffiii: invoke_viiffiii,
                invoke_viiffiiiii: invoke_viiffiiiii,
                invoke_viifi: invoke_viifi,
                invoke_viififififii: invoke_viififififii,
                invoke_viifii: invoke_viifii,
                invoke_viifiii: invoke_viifiii,
                invoke_viifiiii: invoke_viifiiii,
                invoke_viii: invoke_viii,
                invoke_viiidi: invoke_viiidi,
                invoke_viiif: invoke_viiif,
                invoke_viiiffffffffii: invoke_viiiffffffffii,
                invoke_viiifffi: invoke_viiifffi,
                invoke_viiiffi: invoke_viiiffi,
                invoke_viiiffii: invoke_viiiffii,
                invoke_viiifi: invoke_viiifi,
                invoke_viiififfi: invoke_viiififfi,
                invoke_viiififi: invoke_viiififi,
                invoke_viiifii: invoke_viiifii,
                invoke_viiifiii: invoke_viiifiii,
                invoke_viiifiiiii: invoke_viiifiiiii,
                invoke_viiii: invoke_viiii,
                invoke_viiiif: invoke_viiiif,
                invoke_viiiiffi: invoke_viiiiffi,
                invoke_viiiiffii: invoke_viiiiffii,
                invoke_viiiifi: invoke_viiiifi,
                invoke_viiiifii: invoke_viiiifii,
                invoke_viiiifiiii: invoke_viiiifiiii,
                invoke_viiiifiiiiif: invoke_viiiifiiiiif,
                invoke_viiiii: invoke_viiiii,
                invoke_viiiiif: invoke_viiiiif,
                invoke_viiiiifffi: invoke_viiiiifffi,
                invoke_viiiiiffi: invoke_viiiiiffi,
                invoke_viiiiiffii: invoke_viiiiiffii,
                invoke_viiiiifi: invoke_viiiiifi,
                invoke_viiiiii: invoke_viiiiii,
                invoke_viiiiiif: invoke_viiiiiif,
                invoke_viiiiiiffi: invoke_viiiiiiffi,
                invoke_viiiiiii: invoke_viiiiiii,
                invoke_viiiiiiifi: invoke_viiiiiiifi,
                invoke_viiiiiiii: invoke_viiiiiiii,
                invoke_viiiiiiiifi: invoke_viiiiiiiifi,
                invoke_viiiiiiiii: invoke_viiiiiiiii,
                invoke_viiiiiiiiii: invoke_viiiiiiiiii,
                invoke_viiiiiiiiiii: invoke_viiiiiiiiiii,
                invoke_viiiiiiiiiiifii: invoke_viiiiiiiiiiifii,
                invoke_viiiiiiiiiiii: invoke_viiiiiiiiiiii,
                invoke_viiiiiiiiiiiii: invoke_viiiiiiiiiiiii,
                invoke_viiiiiiiiiiiiii: invoke_viiiiiiiiiiiiii,
                invoke_viiiiiiiiiiiiiii: invoke_viiiiiiiiiiiiiii,
                invoke_viiiiiiiiiiiiiiiiii: invoke_viiiiiiiiiiiiiiiiii,
                invoke_viiiiiiiiiji: invoke_viiiiiiiiiji,
                invoke_viiiijii: invoke_viiiijii,
                invoke_viiiijiiii: invoke_viiiijiiii,
                invoke_viiiijjiii: invoke_viiiijjiii,
                invoke_viiiji: invoke_viiiji,
                invoke_viiijii: invoke_viiijii,
                invoke_viiijiii: invoke_viiijiii,
                invoke_viiijiiifi: invoke_viiijiiifi,
                invoke_viiijiiijji: invoke_viiijiiijji,
                invoke_viiijji: invoke_viiijji,
                invoke_viiijjii: invoke_viiijjii,
                invoke_viiijjiii: invoke_viiijjiii,
                invoke_viiijjiijji: invoke_viiijjiijji,
                invoke_viiijjiijjji: invoke_viiijjiijjji,
                invoke_viij: invoke_viij,
                invoke_viiji: invoke_viiji,
                invoke_viijii: invoke_viijii,
                invoke_viijiii: invoke_viijiii,
                invoke_viijiiiiiiiiiii: invoke_viijiiiiiiiiiii,
                invoke_viijiiijji: invoke_viijiiijji,
                invoke_viijiiijjji: invoke_viijiiijjji,
                invoke_viijiijiii: invoke_viijiijiii,
                invoke_viijijii: invoke_viijijii,
                invoke_viijijiii: invoke_viijijiii,
                invoke_viijji: invoke_viijji,
                invoke_viijjii: invoke_viijjii,
                invoke_viijjiii: invoke_viijjiii,
                invoke_viijjji: invoke_viijjji,
                invoke_vij: invoke_vij,
                invoke_viji: invoke_viji,
                invoke_vijii: invoke_vijii,
                invoke_vijiii: invoke_vijiii,
                invoke_vijiiiiii: invoke_vijiiiiii,
                invoke_vijiijjiijjji: invoke_vijiijjiijjji,
                invoke_vijiji: invoke_vijiji,
                invoke_vijijji: invoke_vijijji,
                invoke_vijji: invoke_vijji,
                invoke_vijjii: invoke_vijjii,
                invoke_vijjji: invoke_vijjji,
                invoke_vji: invoke_vji,
                invoke_vjii: invoke_vjii,
                invoke_vjiiii: invoke_vjiiii,
                invoke_vjji: invoke_vjji,
                _JS_Cursor_SetImage: _JS_Cursor_SetImage,
                _JS_Cursor_SetShow: _JS_Cursor_SetShow,
                _JS_Eval_ClearTimeout: _JS_Eval_ClearTimeout,
                _JS_Eval_EvalJS: _JS_Eval_EvalJS,
                _JS_Eval_OpenURL: _JS_Eval_OpenURL,
                _JS_Eval_SetTimeout: _JS_Eval_SetTimeout,
                _JS_FileSystem_Initialize: _JS_FileSystem_Initialize,
                _JS_FileSystem_Sync: _JS_FileSystem_Sync,
                _JS_Log_Dump: _JS_Log_Dump,
                _JS_Log_StackTrace: _JS_Log_StackTrace,
                _JS_Sound_Create_Channel: _JS_Sound_Create_Channel,
                _JS_Sound_GetLength: _JS_Sound_GetLength,
                _JS_Sound_GetLoadState: _JS_Sound_GetLoadState,
                _JS_Sound_Init: _JS_Sound_Init,
                _JS_Sound_Load: _JS_Sound_Load,
                _JS_Sound_Load_PCM: _JS_Sound_Load_PCM,
                _JS_Sound_Play: _JS_Sound_Play,
                _JS_Sound_ReleaseInstance: _JS_Sound_ReleaseInstance,
                _JS_Sound_ResumeIfNeeded: _JS_Sound_ResumeIfNeeded,
                _JS_Sound_Set3D: _JS_Sound_Set3D,
                _JS_Sound_SetListenerOrientation: _JS_Sound_SetListenerOrientation,
                _JS_Sound_SetListenerPosition: _JS_Sound_SetListenerPosition,
                _JS_Sound_SetLoop: _JS_Sound_SetLoop,
                _JS_Sound_SetLoopPoints: _JS_Sound_SetLoopPoints,
                _JS_Sound_SetPitch: _JS_Sound_SetPitch,
                _JS_Sound_SetPosition: _JS_Sound_SetPosition,
                _JS_Sound_SetVolume: _JS_Sound_SetVolume,
                _JS_Sound_Stop: _JS_Sound_Stop,
                _JS_SystemInfo_GetBrowserName: _JS_SystemInfo_GetBrowserName,
                _JS_SystemInfo_GetBrowserVersionString: _JS_SystemInfo_GetBrowserVersionString,
                _JS_SystemInfo_GetCurrentCanvasHeight: _JS_SystemInfo_GetCurrentCanvasHeight,
                _JS_SystemInfo_GetCurrentCanvasWidth: _JS_SystemInfo_GetCurrentCanvasWidth,
                _JS_SystemInfo_GetDocumentURL: _JS_SystemInfo_GetDocumentURL,
                _JS_SystemInfo_GetGPUInfo: _JS_SystemInfo_GetGPUInfo,
                _JS_SystemInfo_GetHeight: _JS_SystemInfo_GetHeight,
                _JS_SystemInfo_GetLanguage: _JS_SystemInfo_GetLanguage,
                _JS_SystemInfo_GetMemory: _JS_SystemInfo_GetMemory,
                _JS_SystemInfo_GetOS: _JS_SystemInfo_GetOS,
                _JS_SystemInfo_GetWidth: _JS_SystemInfo_GetWidth,
                _JS_SystemInfo_HasCursorLock: _JS_SystemInfo_HasCursorLock,
                _JS_SystemInfo_HasFullscreen: _JS_SystemInfo_HasFullscreen,
                _JS_SystemInfo_HasWebGL: _JS_SystemInfo_HasWebGL,
                _JS_UNETWebSockets_AddHost: _JS_UNETWebSockets_AddHost,
                _JS_UNETWebSockets_HostsContainingMessagesCleanHost: _JS_UNETWebSockets_HostsContainingMessagesCleanHost,
                _JS_UNETWebSockets_HostsContainingMessagesPush: _JS_UNETWebSockets_HostsContainingMessagesPush,
                _JS_UNETWebSockets_Init: _JS_UNETWebSockets_Init,
                _JS_UNETWebSockets_IsHostCorrect: _JS_UNETWebSockets_IsHostCorrect,
                _JS_UNETWebSockets_IsHostReadyToConnect: _JS_UNETWebSockets_IsHostReadyToConnect,
                _JS_UNETWebSockets_SocketCleanEvnt: _JS_UNETWebSockets_SocketCleanEvnt,
                _JS_UNETWebSockets_SocketCleanEvntFromHost: _JS_UNETWebSockets_SocketCleanEvntFromHost,
                _JS_UNETWebSockets_SocketClose: _JS_UNETWebSockets_SocketClose,
                _JS_UNETWebSockets_SocketCreate: _JS_UNETWebSockets_SocketCreate,
                _JS_UNETWebSockets_SocketRecvEvntBuff: _JS_UNETWebSockets_SocketRecvEvntBuff,
                _JS_UNETWebSockets_SocketRecvEvntBuffFromHost: _JS_UNETWebSockets_SocketRecvEvntBuffFromHost,
                _JS_UNETWebSockets_SocketRecvEvntBuffLength: _JS_UNETWebSockets_SocketRecvEvntBuffLength,
                _JS_UNETWebSockets_SocketRecvEvntBuffLengthFromHost: _JS_UNETWebSockets_SocketRecvEvntBuffLengthFromHost,
                _JS_UNETWebSockets_SocketRecvEvntHost: _JS_UNETWebSockets_SocketRecvEvntHost,
                _JS_UNETWebSockets_SocketRecvEvntType: _JS_UNETWebSockets_SocketRecvEvntType,
                _JS_UNETWebSockets_SocketRecvEvntTypeFromHost: _JS_UNETWebSockets_SocketRecvEvntTypeFromHost,
                _JS_UNETWebSockets_SocketSend: _JS_UNETWebSockets_SocketSend,
                _JS_UNETWebSockets_SocketStop: _JS_UNETWebSockets_SocketStop,
                _JS_WebRequest_Abort: _JS_WebRequest_Abort,
                _JS_WebRequest_Create: _JS_WebRequest_Create,
                _JS_WebRequest_GetResponseHeaders: _JS_WebRequest_GetResponseHeaders,
                _JS_WebRequest_Release: _JS_WebRequest_Release,
                _JS_WebRequest_Send: _JS_WebRequest_Send,
                _JS_WebRequest_SetProgressHandler: _JS_WebRequest_SetProgressHandler,
                _JS_WebRequest_SetRequestHeader: _JS_WebRequest_SetRequestHeader,
                _JS_WebRequest_SetResponseHandler: _JS_WebRequest_SetResponseHandler,
                _JS_WebRequest_SetTimeout: _JS_WebRequest_SetTimeout,
                __GameCenterGenerateIdentityVerificationSignature: __GameCenterGenerateIdentityVerificationSignature,
                __GameCenterGetLocalPlayer: __GameCenterGetLocalPlayer,
                __GameCenterInit: __GameCenterInit,
                __GameCenterLoadAchievementDescriptions: __GameCenterLoadAchievementDescriptions,
                __GameCenterLoadAchievements: __GameCenterLoadAchievements,
                __GameCenterLoadFriends: __GameCenterLoadFriends,
                __GameCenterLoadLeaderboard: __GameCenterLoadLeaderboard,
                __GameCenterLoadLeaderboardForIDs: __GameCenterLoadLeaderboardForIDs,
                __GameCenterLoadPhoto: __GameCenterLoadPhoto,
                __GameCenterLoadPlayers: __GameCenterLoadPlayers,
                __GameCenterReportAchievement: __GameCenterReportAchievement,
                __GameCenterReportAchievements: __GameCenterReportAchievements,
                __GameCenterReportScore: __GameCenterReportScore,
                __GameCenterResetAchievements: __GameCenterResetAchievements,
                __GameCenterShowLoginView: __GameCenterShowLoginView,
                __GameCenterShowView: __GameCenterShowView,
                __ZSt18uncaught_exceptionv: __ZSt18uncaught_exceptionv,
                ___atomic_fetch_add_8: ___atomic_fetch_add_8,
                ___buildEnvironment: ___buildEnvironment,
                ___cxa_allocate_exception: ___cxa_allocate_exception,
                ___cxa_begin_catch: ___cxa_begin_catch,
                ___cxa_end_catch: ___cxa_end_catch,
                ___cxa_find_matching_catch: ___cxa_find_matching_catch,
                ___cxa_find_matching_catch_2: ___cxa_find_matching_catch_2,
                ___cxa_find_matching_catch_3: ___cxa_find_matching_catch_3,
                ___cxa_find_matching_catch_4: ___cxa_find_matching_catch_4,
                ___cxa_free_exception: ___cxa_free_exception,
                ___cxa_pure_virtual: ___cxa_pure_virtual,
                ___cxa_rethrow: ___cxa_rethrow,
                ___cxa_throw: ___cxa_throw,
                ___gxx_personality_v0: ___gxx_personality_v0,
                ___lock: ___lock,
                ___map_file: ___map_file,
                ___resumeException: ___resumeException,
                ___setErrNo: ___setErrNo,
                ___syscall10: ___syscall10,
                ___syscall102: ___syscall102,
                ___syscall122: ___syscall122,
                ___syscall140: ___syscall140,
                ___syscall142: ___syscall142,
                ___syscall145: ___syscall145,
                ___syscall146: ___syscall146,
                ___syscall15: ___syscall15,
                ___syscall168: ___syscall168,
                ___syscall183: ___syscall183,
                ___syscall192: ___syscall192,
                ___syscall193: ___syscall193,
                ___syscall194: ___syscall194,
                ___syscall195: ___syscall195,
                ___syscall196: ___syscall196,
                ___syscall197: ___syscall197,
                ___syscall199: ___syscall199,
                ___syscall20: ___syscall20,
                ___syscall202: ___syscall202,
                ___syscall220: ___syscall220,
                ___syscall221: ___syscall221,
                ___syscall268: ___syscall268,
                ___syscall3: ___syscall3,
                ___syscall33: ___syscall33,
                ___syscall38: ___syscall38,
                ___syscall39: ___syscall39,
                ___syscall4: ___syscall4,
                ___syscall40: ___syscall40,
                ___syscall41: ___syscall41,
                ___syscall42: ___syscall42,
                ___syscall5: ___syscall5,
                ___syscall54: ___syscall54,
                ___syscall6: ___syscall6,
                ___syscall63: ___syscall63,
                ___syscall77: ___syscall77,
                ___syscall85: ___syscall85,
                ___syscall91: ___syscall91,
                ___unlock: ___unlock,
                __addDays: __addDays,
                __arraySum: __arraySum,
                __emscripten_do_request_fullscreen: __emscripten_do_request_fullscreen,
                __emscripten_sample_gamepad_data: __emscripten_sample_gamepad_data,
                __emscripten_traverse_stack: __emscripten_traverse_stack,
                __exit: __exit,
                __formatString: __formatString,
                __inet_ntop4_raw: __inet_ntop4_raw,
                __inet_ntop6_raw: __inet_ntop6_raw,
                __inet_pton4_raw: __inet_pton4_raw,
                __inet_pton6_raw: __inet_pton6_raw,
                __isLeapYear: __isLeapYear,
                __read_sockaddr: __read_sockaddr,
                __reallyNegative: __reallyNegative,
                __setLetterbox: __setLetterbox,
                __write_sockaddr: __write_sockaddr,
                _abort: _abort,
                _atexit: _atexit,
                _clock: _clock,
                _clock_getres: _clock_getres,
                _clock_gettime: _clock_gettime,
                _difftime: _difftime,
                _dlclose: _dlclose,
                _dlopen: _dlopen,
                _dlsym: _dlsym,
                _emscripten_asm_const_i: _emscripten_asm_const_i,
                _emscripten_asm_const_ii: _emscripten_asm_const_ii,
                _emscripten_asm_const_sync_on_main_thread_i: _emscripten_asm_const_sync_on_main_thread_i,
                _emscripten_cancel_main_loop: _emscripten_cancel_main_loop,
                _emscripten_exit_fullscreen: _emscripten_exit_fullscreen,
                _emscripten_exit_pointerlock: _emscripten_exit_pointerlock,
                _emscripten_get_callstack_js: _emscripten_get_callstack_js,
                _emscripten_get_canvas_element_size: _emscripten_get_canvas_element_size,
                _emscripten_get_canvas_element_size_calling_thread: _emscripten_get_canvas_element_size_calling_thread,
                _emscripten_get_canvas_element_size_main_thread: _emscripten_get_canvas_element_size_main_thread,
                _emscripten_get_fullscreen_status: _emscripten_get_fullscreen_status,
                _emscripten_get_gamepad_status: _emscripten_get_gamepad_status,
                _emscripten_get_main_loop_timing: _emscripten_get_main_loop_timing,
                _emscripten_get_now: _emscripten_get_now,
                _emscripten_get_now_is_monotonic: _emscripten_get_now_is_monotonic,
                _emscripten_get_now_res: _emscripten_get_now_res,
                _emscripten_get_num_gamepads: _emscripten_get_num_gamepads,
                _emscripten_has_threading_support: _emscripten_has_threading_support,
                _emscripten_html5_remove_all_event_listeners: _emscripten_html5_remove_all_event_listeners,
                _emscripten_is_webgl_context_lost: _emscripten_is_webgl_context_lost,
                _emscripten_log: _emscripten_log,
                _emscripten_log_js: _emscripten_log_js,
                _emscripten_longjmp: _emscripten_longjmp,
                _emscripten_memcpy_big: _emscripten_memcpy_big,
                _emscripten_num_logical_cores: _emscripten_num_logical_cores,
                _emscripten_request_fullscreen: _emscripten_request_fullscreen,
                _emscripten_request_pointerlock: _emscripten_request_pointerlock,
                _emscripten_set_blur_callback_on_thread: _emscripten_set_blur_callback_on_thread,
                _emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
                _emscripten_set_canvas_element_size_calling_thread: _emscripten_set_canvas_element_size_calling_thread,
                _emscripten_set_canvas_element_size_main_thread: _emscripten_set_canvas_element_size_main_thread,
                _emscripten_set_dblclick_callback_on_thread: _emscripten_set_dblclick_callback_on_thread,
                _emscripten_set_devicemotion_callback_on_thread: _emscripten_set_devicemotion_callback_on_thread,
                _emscripten_set_deviceorientation_callback_on_thread: _emscripten_set_deviceorientation_callback_on_thread,
                _emscripten_set_focus_callback_on_thread: _emscripten_set_focus_callback_on_thread,
                _emscripten_set_fullscreenchange_callback_on_thread: _emscripten_set_fullscreenchange_callback_on_thread,
                _emscripten_set_gamepadconnected_callback_on_thread: _emscripten_set_gamepadconnected_callback_on_thread,
                _emscripten_set_gamepaddisconnected_callback_on_thread: _emscripten_set_gamepaddisconnected_callback_on_thread,
                _emscripten_set_keydown_callback_on_thread: _emscripten_set_keydown_callback_on_thread,
                _emscripten_set_keypress_callback_on_thread: _emscripten_set_keypress_callback_on_thread,
                _emscripten_set_keyup_callback_on_thread: _emscripten_set_keyup_callback_on_thread,
                _emscripten_set_main_loop: _emscripten_set_main_loop,
                _emscripten_set_main_loop_timing: _emscripten_set_main_loop_timing,
                _emscripten_set_mousedown_callback_on_thread: _emscripten_set_mousedown_callback_on_thread,
                _emscripten_set_mousemove_callback_on_thread: _emscripten_set_mousemove_callback_on_thread,
                _emscripten_set_mouseup_callback_on_thread: _emscripten_set_mouseup_callback_on_thread,
                _emscripten_set_touchcancel_callback_on_thread: _emscripten_set_touchcancel_callback_on_thread,
                _emscripten_set_touchend_callback_on_thread: _emscripten_set_touchend_callback_on_thread,
                _emscripten_set_touchmove_callback_on_thread: _emscripten_set_touchmove_callback_on_thread,
                _emscripten_set_touchstart_callback_on_thread: _emscripten_set_touchstart_callback_on_thread,
                _emscripten_set_wheel_callback_on_thread: _emscripten_set_wheel_callback_on_thread,
                _emscripten_webgl_create_context: _emscripten_webgl_create_context,
                _emscripten_webgl_destroy_context: _emscripten_webgl_destroy_context,
                _emscripten_webgl_destroy_context_calling_thread: _emscripten_webgl_destroy_context_calling_thread,
                _emscripten_webgl_do_create_context: _emscripten_webgl_do_create_context,
                _emscripten_webgl_do_get_current_context: _emscripten_webgl_do_get_current_context,
                _emscripten_webgl_enable_extension: _emscripten_webgl_enable_extension,
                _emscripten_webgl_enable_extension_calling_thread: _emscripten_webgl_enable_extension_calling_thread,
                _emscripten_webgl_get_current_context: _emscripten_webgl_get_current_context,
                _emscripten_webgl_init_context_attributes: _emscripten_webgl_init_context_attributes,
                _emscripten_webgl_make_context_current: _emscripten_webgl_make_context_current,
                _exit: _exit,
                _flock: _flock,
                _getaddrinfo: _getaddrinfo,
                _getenv: _getenv,
                _gethostbyaddr: _gethostbyaddr,
                _gethostbyname: _gethostbyname,
                _getnameinfo: _getnameinfo,
                _getpwuid: _getpwuid,
                _gettimeofday: _gettimeofday,
                _glActiveTexture: _glActiveTexture,
                _glAttachShader: _glAttachShader,
                _glBeginQuery: _glBeginQuery,
                _glBeginTransformFeedback: _glBeginTransformFeedback,
                _glBindAttribLocation: _glBindAttribLocation,
                _glBindBuffer: _glBindBuffer,
                _glBindBufferBase: _glBindBufferBase,
                _glBindBufferRange: _glBindBufferRange,
                _glBindFramebuffer: _glBindFramebuffer,
                _glBindRenderbuffer: _glBindRenderbuffer,
                _glBindSampler: _glBindSampler,
                _glBindTexture: _glBindTexture,
                _glBindTransformFeedback: _glBindTransformFeedback,
                _glBindVertexArray: _glBindVertexArray,
                _glBlendEquation: _glBlendEquation,
                _glBlendEquationSeparate: _glBlendEquationSeparate,
                _glBlendFuncSeparate: _glBlendFuncSeparate,
                _glBlitFramebuffer: _glBlitFramebuffer,
                _glBufferData: _glBufferData,
                _glBufferSubData: _glBufferSubData,
                _glCheckFramebufferStatus: _glCheckFramebufferStatus,
                _glClear: _glClear,
                _glClearColor: _glClearColor,
                _glClearDepthf: _glClearDepthf,
                _glClearStencil: _glClearStencil,
                _glClientWaitSync: _glClientWaitSync,
                _glColorMask: _glColorMask,
                _glCompileShader: _glCompileShader,
                _glCompressedTexImage2D: _glCompressedTexImage2D,
                _glCompressedTexSubImage2D: _glCompressedTexSubImage2D,
                _glCompressedTexSubImage3D: _glCompressedTexSubImage3D,
                _glCopyBufferSubData: _glCopyBufferSubData,
                _glCopyTexImage2D: _glCopyTexImage2D,
                _glCopyTexSubImage2D: _glCopyTexSubImage2D,
                _glCreateProgram: _glCreateProgram,
                _glCreateShader: _glCreateShader,
                _glCullFace: _glCullFace,
                _glDeleteBuffers: _glDeleteBuffers,
                _glDeleteFramebuffers: _glDeleteFramebuffers,
                _glDeleteProgram: _glDeleteProgram,
                _glDeleteQueries: _glDeleteQueries,
                _glDeleteRenderbuffers: _glDeleteRenderbuffers,
                _glDeleteSamplers: _glDeleteSamplers,
                _glDeleteShader: _glDeleteShader,
                _glDeleteSync: _glDeleteSync,
                _glDeleteTextures: _glDeleteTextures,
                _glDeleteTransformFeedbacks: _glDeleteTransformFeedbacks,
                _glDeleteVertexArrays: _glDeleteVertexArrays,
                _glDepthFunc: _glDepthFunc,
                _glDepthMask: _glDepthMask,
                _glDetachShader: _glDetachShader,
                _glDisable: _glDisable,
                _glDisableVertexAttribArray: _glDisableVertexAttribArray,
                _glDrawArrays: _glDrawArrays,
                _glDrawArraysInstanced: _glDrawArraysInstanced,
                _glDrawBuffers: _glDrawBuffers,
                _glDrawElements: _glDrawElements,
                _glDrawElementsInstanced: _glDrawElementsInstanced,
                _glEnable: _glEnable,
                _glEnableVertexAttribArray: _glEnableVertexAttribArray,
                _glEndQuery: _glEndQuery,
                _glEndTransformFeedback: _glEndTransformFeedback,
                _glFenceSync: _glFenceSync,
                _glFinish: _glFinish,
                _glFlush: _glFlush,
                _glFlushMappedBufferRange: _glFlushMappedBufferRange,
                _glFramebufferRenderbuffer: _glFramebufferRenderbuffer,
                _glFramebufferTexture2D: _glFramebufferTexture2D,
                _glFramebufferTextureLayer: _glFramebufferTextureLayer,
                _glFrontFace: _glFrontFace,
                _glGenBuffers: _glGenBuffers,
                _glGenFramebuffers: _glGenFramebuffers,
                _glGenQueries: _glGenQueries,
                _glGenRenderbuffers: _glGenRenderbuffers,
                _glGenSamplers: _glGenSamplers,
                _glGenTextures: _glGenTextures,
                _glGenTransformFeedbacks: _glGenTransformFeedbacks,
                _glGenVertexArrays: _glGenVertexArrays,
                _glGenerateMipmap: _glGenerateMipmap,
                _glGetActiveAttrib: _glGetActiveAttrib,
                _glGetActiveUniform: _glGetActiveUniform,
                _glGetActiveUniformBlockName: _glGetActiveUniformBlockName,
                _glGetActiveUniformBlockiv: _glGetActiveUniformBlockiv,
                _glGetActiveUniformsiv: _glGetActiveUniformsiv,
                _glGetAttribLocation: _glGetAttribLocation,
                _glGetError: _glGetError,
                _glGetFramebufferAttachmentParameteriv: _glGetFramebufferAttachmentParameteriv,
                _glGetIntegeri_v: _glGetIntegeri_v,
                _glGetIntegerv: _glGetIntegerv,
                _glGetInternalformativ: _glGetInternalformativ,
                _glGetProgramBinary: _glGetProgramBinary,
                _glGetProgramInfoLog: _glGetProgramInfoLog,
                _glGetProgramiv: _glGetProgramiv,
                _glGetRenderbufferParameteriv: _glGetRenderbufferParameteriv,
                _glGetShaderInfoLog: _glGetShaderInfoLog,
                _glGetShaderPrecisionFormat: _glGetShaderPrecisionFormat,
                _glGetShaderSource: _glGetShaderSource,
                _glGetShaderiv: _glGetShaderiv,
                _glGetString: _glGetString,
                _glGetStringi: _glGetStringi,
                _glGetTexParameteriv: _glGetTexParameteriv,
                _glGetUniformBlockIndex: _glGetUniformBlockIndex,
                _glGetUniformIndices: _glGetUniformIndices,
                _glGetUniformLocation: _glGetUniformLocation,
                _glGetUniformiv: _glGetUniformiv,
                _glGetVertexAttribiv: _glGetVertexAttribiv,
                _glInvalidateFramebuffer: _glInvalidateFramebuffer,
                _glIsEnabled: _glIsEnabled,
                _glIsVertexArray: _glIsVertexArray,
                _glLinkProgram: _glLinkProgram,
                _glMapBufferRange: _glMapBufferRange,
                _glPixelStorei: _glPixelStorei,
                _glPolygonOffset: _glPolygonOffset,
                _glProgramBinary: _glProgramBinary,
                _glProgramParameteri: _glProgramParameteri,
                _glReadBuffer: _glReadBuffer,
                _glReadPixels: _glReadPixels,
                _glRenderbufferStorage: _glRenderbufferStorage,
                _glRenderbufferStorageMultisample: _glRenderbufferStorageMultisample,
                _glSamplerParameteri: _glSamplerParameteri,
                _glScissor: _glScissor,
                _glShaderSource: _glShaderSource,
                _glStencilFuncSeparate: _glStencilFuncSeparate,
                _glStencilMask: _glStencilMask,
                _glStencilOpSeparate: _glStencilOpSeparate,
                _glTexImage2D: _glTexImage2D,
                _glTexImage3D: _glTexImage3D,
                _glTexParameterf: _glTexParameterf,
                _glTexParameteri: _glTexParameteri,
                _glTexParameteriv: _glTexParameteriv,
                _glTexStorage2D: _glTexStorage2D,
                _glTexStorage3D: _glTexStorage3D,
                _glTexSubImage2D: _glTexSubImage2D,
                _glTexSubImage3D: _glTexSubImage3D,
                _glTransformFeedbackVaryings: _glTransformFeedbackVaryings,
                _glUniform1fv: _glUniform1fv,
                _glUniform1i: _glUniform1i,
                _glUniform1iv: _glUniform1iv,
                _glUniform1uiv: _glUniform1uiv,
                _glUniform2fv: _glUniform2fv,
                _glUniform2iv: _glUniform2iv,
                _glUniform2uiv: _glUniform2uiv,
                _glUniform3fv: _glUniform3fv,
                _glUniform3iv: _glUniform3iv,
                _glUniform3uiv: _glUniform3uiv,
                _glUniform4fv: _glUniform4fv,
                _glUniform4iv: _glUniform4iv,
                _glUniform4uiv: _glUniform4uiv,
                _glUniformBlockBinding: _glUniformBlockBinding,
                _glUniformMatrix3fv: _glUniformMatrix3fv,
                _glUniformMatrix4fv: _glUniformMatrix4fv,
                _glUnmapBuffer: _glUnmapBuffer,
                _glUseProgram: _glUseProgram,
                _glValidateProgram: _glValidateProgram,
                _glVertexAttrib4f: _glVertexAttrib4f,
                _glVertexAttrib4fv: _glVertexAttrib4fv,
                _glVertexAttribIPointer: _glVertexAttribIPointer,
                _glVertexAttribPointer: _glVertexAttribPointer,
                _glViewport: _glViewport,
                _gmtime: _gmtime,
                _gmtime_r: _gmtime_r,
                _inet_addr: _inet_addr,
                _llvm_ceil_f32: _llvm_ceil_f32,
                _llvm_ceil_f64: _llvm_ceil_f64,
                _llvm_copysign_f64: _llvm_copysign_f64,
                _llvm_cttz_i32: _llvm_cttz_i32,
                _llvm_eh_typeid_for: _llvm_eh_typeid_for,
                _llvm_exp2_f32: _llvm_exp2_f32,
                _llvm_fabs_f32: _llvm_fabs_f32,
                _llvm_fabs_f64: _llvm_fabs_f64,
                _llvm_floor_f32: _llvm_floor_f32,
                _llvm_floor_f64: _llvm_floor_f64,
                _llvm_log10_f32: _llvm_log10_f32,
                _llvm_log2_f32: _llvm_log2_f32,
                _llvm_pow_f64: _llvm_pow_f64,
                _llvm_sqrt_f32: _llvm_sqrt_f32,
                _llvm_trap: _llvm_trap,
                _llvm_trunc_f32: _llvm_trunc_f32,
                _localtime: _localtime,
                _localtime_r: _localtime_r,
                _longjmp: _longjmp,
                _mktime: _mktime,
                _pthread_cond_destroy: _pthread_cond_destroy,
                _pthread_cond_init: _pthread_cond_init,
                _pthread_cond_timedwait: _pthread_cond_timedwait,
                _pthread_cond_wait: _pthread_cond_wait,
                _pthread_getspecific: _pthread_getspecific,
                _pthread_key_create: _pthread_key_create,
                _pthread_key_delete: _pthread_key_delete,
                _pthread_mutex_destroy: _pthread_mutex_destroy,
                _pthread_mutex_init: _pthread_mutex_init,
                _pthread_mutexattr_destroy: _pthread_mutexattr_destroy,
                _pthread_mutexattr_init: _pthread_mutexattr_init,
                _pthread_mutexattr_setprotocol: _pthread_mutexattr_setprotocol,
                _pthread_mutexattr_settype: _pthread_mutexattr_settype,
                _pthread_once: _pthread_once,
                _pthread_setspecific: _pthread_setspecific,
                _sched_yield: _sched_yield,
                _setenv: _setenv,
                _sigaction: _sigaction,
                _sigemptyset: _sigemptyset,
                _strftime: _strftime,
                _sysconf: _sysconf,
                _time: _time,
                _tzset: _tzset,
                _unsetenv: _unsetenv,
                _utime: _utime,
                emscriptenWebGLComputeImageSize: emscriptenWebGLComputeImageSize,
                emscriptenWebGLGet: emscriptenWebGLGet,
                emscriptenWebGLGetBufferBinding: emscriptenWebGLGetBufferBinding,
                emscriptenWebGLGetHeapForType: emscriptenWebGLGetHeapForType,
                emscriptenWebGLGetIndexed: emscriptenWebGLGetIndexed,
                emscriptenWebGLGetShiftForType: emscriptenWebGLGetShiftForType,
                emscriptenWebGLGetTexPixelData: emscriptenWebGLGetTexPixelData,
                emscriptenWebGLGetUniform: emscriptenWebGLGetUniform,
                emscriptenWebGLGetVertexAttrib: emscriptenWebGLGetVertexAttrib,
                emscriptenWebGLValidateMapBufferTarget: emscriptenWebGLValidateMapBufferTarget,
                emscripten_get_canvas_element_size_js: emscripten_get_canvas_element_size_js,
                emscripten_set_canvas_element_size_js: emscripten_set_canvas_element_size_js,
                DYNAMICTOP_PTR: DYNAMICTOP_PTR,
                tempDoublePtr: tempDoublePtr,
                ABORT: ABORT,
                STACKTOP: STACKTOP,
                STACK_MAX: STACK_MAX
            }, asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer), Module["asm"] = asm, _SendMessage = Module["_SendMessage"] = function() {
                return Module["asm"]["_SendMessage"].apply(null, arguments)
            }, _SendMessageFloat = Module["_SendMessageFloat"] = function() {
                return Module["asm"]["_SendMessageFloat"].apply(null, arguments)
            }, _SendMessageString = Module["_SendMessageString"] = function() {
                return Module["asm"]["_SendMessageString"].apply(null, arguments)
            }, _SetFullscreen = Module["_SetFullscreen"] = function() {
                return Module["asm"]["_SetFullscreen"].apply(null, arguments)
            }, __GLOBAL__sub_I_AIScriptingClasses_cpp = Module["__GLOBAL__sub_I_AIScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_AIScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_ARScriptingClasses_cpp = Module["__GLOBAL__sub_I_ARScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_ARScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_AccessibilityScriptingClasses_cpp = Module["__GLOBAL__sub_I_AccessibilityScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_AccessibilityScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp = Module["__GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_AndroidPermissions_bindings_cpp = Module["__GLOBAL__sub_I_AndroidPermissions_bindings_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_AndroidPermissions_bindings_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_AnimationClip_cpp = Module["__GLOBAL__sub_I_AnimationClip_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_AnimationClip_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_AnimationScriptingClasses_cpp = Module["__GLOBAL__sub_I_AnimationScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_AnimationScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_AssetBundleFileSystem_cpp = Module["__GLOBAL__sub_I_AssetBundleFileSystem_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_AssetBundleFileSystem_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_AssetBundleScriptingClasses_cpp = Module["__GLOBAL__sub_I_AssetBundleScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_AssetBundleScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_AudioScriptingClasses_cpp = Module["__GLOBAL__sub_I_AudioScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_AudioScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Avatar_cpp = Module["__GLOBAL__sub_I_Avatar_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Avatar_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_ClothScriptingClasses_cpp = Module["__GLOBAL__sub_I_ClothScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_ClothScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_ConstraintManager_cpp = Module["__GLOBAL__sub_I_ConstraintManager_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_ConstraintManager_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_DirectorScriptingClasses_cpp = Module["__GLOBAL__sub_I_DirectorScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_DirectorScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp = Module["__GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_External_Yoga_Yoga_0_cpp = Module["__GLOBAL__sub_I_External_Yoga_Yoga_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_External_Yoga_Yoga_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_GfxDeviceNull_cpp = Module["__GLOBAL__sub_I_GfxDeviceNull_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_GfxDeviceNull_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_GridScriptingClasses_cpp = Module["__GLOBAL__sub_I_GridScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_GridScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_IMGUIScriptingClasses_cpp = Module["__GLOBAL__sub_I_IMGUIScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_IMGUIScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Il2CppCodeRegistration_cpp = Module["__GLOBAL__sub_I_Il2CppCodeRegistration_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Il2CppCodeRegistration_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_InputLegacyScriptingClasses_cpp = Module["__GLOBAL__sub_I_InputLegacyScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_InputLegacyScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_InputScriptingClasses_cpp = Module["__GLOBAL__sub_I_InputScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_InputScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_LogAssert_cpp = Module["__GLOBAL__sub_I_LogAssert_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_LogAssert_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Lump_libil2cpp_gc_cpp = Module["__GLOBAL__sub_I_Lump_libil2cpp_gc_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_gc_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Lump_libil2cpp_metadata_cpp = Module["__GLOBAL__sub_I_Lump_libil2cpp_metadata_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_metadata_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Lump_libil2cpp_os_cpp = Module["__GLOBAL__sub_I_Lump_libil2cpp_os_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_os_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Lump_libil2cpp_utils_cpp = Module["__GLOBAL__sub_I_Lump_libil2cpp_utils_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_utils_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Lump_libil2cpp_vm_cpp = Module["__GLOBAL__sub_I_Lump_libil2cpp_vm_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_vm_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Animation_1_cpp = Module["__GLOBAL__sub_I_Modules_Animation_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Animation_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Animation_3_cpp = Module["__GLOBAL__sub_I_Modules_Animation_3_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Animation_3_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Animation_6_cpp = Module["__GLOBAL__sub_I_Modules_Animation_6_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Animation_6_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp = Module["__GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Audio_Public_0_cpp = Module["__GLOBAL__sub_I_Modules_Audio_Public_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Audio_Public_1_cpp = Module["__GLOBAL__sub_I_Modules_Audio_Public_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Audio_Public_3_cpp = Module["__GLOBAL__sub_I_Modules_Audio_Public_3_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_3_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_0_cpp = Module["__GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp = Module["__GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Cloth_0_cpp = Module["__GLOBAL__sub_I_Modules_Cloth_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Cloth_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp = Module["__GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Grid_Public_0_cpp = Module["__GLOBAL__sub_I_Modules_Grid_Public_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Grid_Public_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_IMGUI_0_cpp = Module["__GLOBAL__sub_I_Modules_IMGUI_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_IMGUI_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_IMGUI_1_cpp = Module["__GLOBAL__sub_I_Modules_IMGUI_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_IMGUI_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Input_Private_0_cpp = Module["__GLOBAL__sub_I_Modules_Input_Private_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Input_Private_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_ParticleSystem_Modules_3_cpp = Module["__GLOBAL__sub_I_Modules_ParticleSystem_Modules_3_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_ParticleSystem_Modules_3_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp = Module["__GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Physics2D_Public_1_cpp = Module["__GLOBAL__sub_I_Modules_Physics2D_Public_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Physics2D_Public_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Physics_0_cpp = Module["__GLOBAL__sub_I_Modules_Physics_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Physics_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Physics_1_cpp = Module["__GLOBAL__sub_I_Modules_Physics_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Physics_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Profiler_Public_0_cpp = Module["__GLOBAL__sub_I_Modules_Profiler_Public_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Profiler_Public_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Terrain_Public_0_cpp = Module["__GLOBAL__sub_I_Modules_Terrain_Public_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_Public_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Terrain_Public_1_cpp = Module["__GLOBAL__sub_I_Modules_Terrain_Public_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_Public_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Terrain_Public_2_cpp = Module["__GLOBAL__sub_I_Modules_Terrain_Public_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_Public_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Terrain_Public_3_cpp = Module["__GLOBAL__sub_I_Modules_Terrain_Public_3_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_Public_3_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Terrain_VR_0_cpp = Module["__GLOBAL__sub_I_Modules_Terrain_VR_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_VR_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_TextCore_Native_FontEngine_0_cpp = Module["__GLOBAL__sub_I_Modules_TextCore_Native_FontEngine_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_TextCore_Native_FontEngine_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_TextRendering_Public_1_cpp = Module["__GLOBAL__sub_I_Modules_TextRendering_Public_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_TextRendering_Public_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Tilemap_0_cpp = Module["__GLOBAL__sub_I_Modules_Tilemap_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Tilemap_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp = Module["__GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_UI_0_cpp = Module["__GLOBAL__sub_I_Modules_UI_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_UI_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_UI_1_cpp = Module["__GLOBAL__sub_I_Modules_UI_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_UI_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_UI_2_cpp = Module["__GLOBAL__sub_I_Modules_UI_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_UI_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_UnityAnalytics_Dispatcher_0_cpp = Module["__GLOBAL__sub_I_Modules_UnityAnalytics_Dispatcher_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_UnityAnalytics_Dispatcher_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp = Module["__GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_VFX_Public_1_cpp = Module["__GLOBAL__sub_I_Modules_VFX_Public_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_VFX_Public_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_VFX_Public_2_cpp = Module["__GLOBAL__sub_I_Modules_VFX_Public_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_VFX_Public_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_VR_2_cpp = Module["__GLOBAL__sub_I_Modules_VR_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_VR_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_VR_PluginInterface_0_cpp = Module["__GLOBAL__sub_I_Modules_VR_PluginInterface_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_VR_PluginInterface_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp = Module["__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_NvCloth_src_0_cpp = Module["__GLOBAL__sub_I_NvCloth_src_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_NvCloth_src_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_NvCloth_src_1_cpp = Module["__GLOBAL__sub_I_NvCloth_src_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_NvCloth_src_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_ParticleSystemRenderer_cpp = Module["__GLOBAL__sub_I_ParticleSystemRenderer_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_ParticleSystemRenderer_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp = Module["__GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Physics2DScriptingClasses_cpp = Module["__GLOBAL__sub_I_Physics2DScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Physics2DScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_PhysicsQuery_cpp = Module["__GLOBAL__sub_I_PhysicsQuery_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_PhysicsQuery_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_PhysicsScriptingClasses_cpp = Module["__GLOBAL__sub_I_PhysicsScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_PhysicsScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Platforms_WebGL_Source_PAL_0_cpp = Module["__GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Platforms_WebGL_Source_PAL_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Platforms_WebGL_Source_PAL_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp = Module["__GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp = Module["__GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp = Module["__GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp = Module["__GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Allocator_1_cpp = Module["__GLOBAL__sub_I_Runtime_Allocator_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Allocator_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Application_0_cpp = Module["__GLOBAL__sub_I_Runtime_Application_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Application_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_BaseClasses_0_cpp = Module["__GLOBAL__sub_I_Runtime_BaseClasses_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_BaseClasses_1_cpp = Module["__GLOBAL__sub_I_Runtime_BaseClasses_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_BaseClasses_2_cpp = Module["__GLOBAL__sub_I_Runtime_BaseClasses_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_BaseClasses_3_cpp = Module["__GLOBAL__sub_I_Runtime_BaseClasses_3_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_3_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Burst_0_cpp = Module["__GLOBAL__sub_I_Runtime_Burst_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Burst_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_0_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_1_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_2_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_3_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_3_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_3_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_4_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_4_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_4_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_5_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_5_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_5_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_6_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_6_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_6_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_7_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_7_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_7_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp = Module["__GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Containers_0_cpp = Module["__GLOBAL__sub_I_Runtime_Containers_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Containers_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp = Module["__GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Director_Core_1_cpp = Module["__GLOBAL__sub_I_Runtime_Director_Core_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Director_Core_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_File_0_cpp = Module["__GLOBAL__sub_I_Runtime_File_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_File_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Geometry_2_cpp = Module["__GLOBAL__sub_I_Runtime_Geometry_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Geometry_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_GfxDevice_1_cpp = Module["__GLOBAL__sub_I_Runtime_GfxDevice_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_GfxDevice_2_cpp = Module["__GLOBAL__sub_I_Runtime_GfxDevice_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_GfxDevice_3_cpp = Module["__GLOBAL__sub_I_Runtime_GfxDevice_3_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_3_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_GfxDevice_4_cpp = Module["__GLOBAL__sub_I_Runtime_GfxDevice_4_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_4_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_GfxDevice_5_cpp = Module["__GLOBAL__sub_I_Runtime_GfxDevice_5_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_5_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp = Module["__GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_0_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_10_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_10_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_10_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_11_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_11_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_11_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_1_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_5_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_5_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_5_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_6_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_6_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_6_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_7_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_7_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_7_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_8_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_8_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_8_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_9_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_9_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_9_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp = Module["__GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Input_0_cpp = Module["__GLOBAL__sub_I_Runtime_Input_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Input_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Interfaces_0_cpp = Module["__GLOBAL__sub_I_Runtime_Interfaces_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Interfaces_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Interfaces_1_cpp = Module["__GLOBAL__sub_I_Runtime_Interfaces_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Interfaces_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Interfaces_2_cpp = Module["__GLOBAL__sub_I_Runtime_Interfaces_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Interfaces_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Jobs_0_cpp = Module["__GLOBAL__sub_I_Runtime_Jobs_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Jobs_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp = Module["__GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Math_2_cpp = Module["__GLOBAL__sub_I_Runtime_Math_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Math_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Math_Random_0_cpp = Module["__GLOBAL__sub_I_Runtime_Math_Random_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Math_Random_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Misc_0_cpp = Module["__GLOBAL__sub_I_Runtime_Misc_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Misc_2_cpp = Module["__GLOBAL__sub_I_Runtime_Misc_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Misc_4_cpp = Module["__GLOBAL__sub_I_Runtime_Misc_4_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_4_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Misc_5_cpp = Module["__GLOBAL__sub_I_Runtime_Misc_5_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_5_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Modules_0_cpp = Module["__GLOBAL__sub_I_Runtime_Modules_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Modules_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp = Module["__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp = Module["__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_PluginInterface_0_cpp = Module["__GLOBAL__sub_I_Runtime_PluginInterface_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_PluginInterface_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_PreloadManager_0_cpp = Module["__GLOBAL__sub_I_Runtime_PreloadManager_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_PreloadManager_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Profiler_0_cpp = Module["__GLOBAL__sub_I_Runtime_Profiler_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Profiler_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Profiler_2_cpp = Module["__GLOBAL__sub_I_Runtime_Profiler_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Profiler_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_SceneManager_0_cpp = Module["__GLOBAL__sub_I_Runtime_SceneManager_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_SceneManager_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp = Module["__GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Scripting_0_cpp = Module["__GLOBAL__sub_I_Runtime_Scripting_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Scripting_2_cpp = Module["__GLOBAL__sub_I_Runtime_Scripting_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Scripting_3_cpp = Module["__GLOBAL__sub_I_Runtime_Scripting_3_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_3_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp = Module["__GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Serialize_2_cpp = Module["__GLOBAL__sub_I_Runtime_Serialize_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Serialize_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp = Module["__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp = Module["__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Shaders_0_cpp = Module["__GLOBAL__sub_I_Runtime_Shaders_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Shaders_2_cpp = Module["__GLOBAL__sub_I_Runtime_Shaders_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp = Module["__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp = Module["__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Transform_0_cpp = Module["__GLOBAL__sub_I_Runtime_Transform_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Transform_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Transform_1_cpp = Module["__GLOBAL__sub_I_Runtime_Transform_1_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Transform_1_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Utilities_2_cpp = Module["__GLOBAL__sub_I_Runtime_Utilities_2_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_2_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Utilities_5_cpp = Module["__GLOBAL__sub_I_Runtime_Utilities_5_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_5_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Utilities_6_cpp = Module["__GLOBAL__sub_I_Runtime_Utilities_6_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_6_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Utilities_7_cpp = Module["__GLOBAL__sub_I_Runtime_Utilities_7_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_7_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Utilities_9_cpp = Module["__GLOBAL__sub_I_Runtime_Utilities_9_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_9_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_Video_0_cpp = Module["__GLOBAL__sub_I_Runtime_Video_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_Video_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp = Module["__GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Shader_cpp = Module["__GLOBAL__sub_I_Shader_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Shader_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Shadows_cpp = Module["__GLOBAL__sub_I_Shadows_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Shadows_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_ShapeModule_cpp = Module["__GLOBAL__sub_I_ShapeModule_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_ShapeModule_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_SpriteRendererJobs_cpp = Module["__GLOBAL__sub_I_SpriteRendererJobs_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_SpriteRendererJobs_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_TerrainScriptingClasses_cpp = Module["__GLOBAL__sub_I_TerrainScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_TerrainScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_TextCoreScriptingClasses_cpp = Module["__GLOBAL__sub_I_TextCoreScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_TextCoreScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_TextRenderingScriptingClasses_cpp = Module["__GLOBAL__sub_I_TextRenderingScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_TextRenderingScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_TilemapScriptingClasses_cpp = Module["__GLOBAL__sub_I_TilemapScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_TilemapScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Transform_cpp = Module["__GLOBAL__sub_I_Transform_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Transform_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_UIElementsScriptingClasses_cpp = Module["__GLOBAL__sub_I_UIElementsScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_UIElementsScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_UIScriptingClasses_cpp = Module["__GLOBAL__sub_I_UIScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_UIScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_UnityAdsSettings_cpp = Module["__GLOBAL__sub_I_UnityAdsSettings_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_UnityAdsSettings_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp = Module["__GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp = Module["__GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_UnsafeUtility_bindings_cpp = Module["__GLOBAL__sub_I_UnsafeUtility_bindings_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_UnsafeUtility_bindings_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_VFXScriptingClasses_cpp = Module["__GLOBAL__sub_I_VFXScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_VFXScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_VRScriptingClasses_cpp = Module["__GLOBAL__sub_I_VRScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_VRScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_VideoScriptingClasses_cpp = Module["__GLOBAL__sub_I_VideoScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_VideoScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_Wind_cpp = Module["__GLOBAL__sub_I_Wind_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_Wind_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_XRScriptingClasses_cpp = Module["__GLOBAL__sub_I_XRScriptingClasses_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_XRScriptingClasses_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp = Module["__GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_artifacts_WebGL_modules_Core_WebGL_asmjs_nondev_i_r_nothreads_3_cpp = Module["__GLOBAL__sub_I_artifacts_WebGL_modules_Core_WebGL_asmjs_nondev_i_r_nothreads_3_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_artifacts_WebGL_modules_Core_WebGL_asmjs_nondev_i_r_nothreads_3_cpp"].apply(null, arguments)
            }, __GLOBAL__sub_I_umbra_cpp = Module["__GLOBAL__sub_I_umbra_cpp"] = function() {
                return Module["asm"]["__GLOBAL__sub_I_umbra_cpp"].apply(null, arguments)
            }, ___cxa_can_catch = Module["___cxa_can_catch"] = function() {
                return Module["asm"]["___cxa_can_catch"].apply(null, arguments)
            }, ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = function() {
                return Module["asm"]["___cxa_is_pointer_type"].apply(null, arguments)
            }, ___cxx_global_var_init = Module["___cxx_global_var_init"] = function() {
                return Module["asm"]["___cxx_global_var_init"].apply(null, arguments)
            }, ___cxx_global_var_init_129 = Module["___cxx_global_var_init_129"] = function() {
                return Module["asm"]["___cxx_global_var_init_129"].apply(null, arguments)
            }, ___cxx_global_var_init_18 = Module["___cxx_global_var_init_18"] = function() {
                return Module["asm"]["___cxx_global_var_init_18"].apply(null, arguments)
            }, ___cxx_global_var_init_18_4873 = Module["___cxx_global_var_init_18_4873"] = function() {
                return Module["asm"]["___cxx_global_var_init_18_4873"].apply(null, arguments)
            }, ___cxx_global_var_init_19 = Module["___cxx_global_var_init_19"] = function() {
                return Module["asm"]["___cxx_global_var_init_19"].apply(null, arguments)
            }, ___cxx_global_var_init_20 = Module["___cxx_global_var_init_20"] = function() {
                return Module["asm"]["___cxx_global_var_init_20"].apply(null, arguments)
            }, ___cxx_global_var_init_22 = Module["___cxx_global_var_init_22"] = function() {
                return Module["asm"]["___cxx_global_var_init_22"].apply(null, arguments)
            }, ___cxx_global_var_init_2_9458 = Module["___cxx_global_var_init_2_9458"] = function() {
                return Module["asm"]["___cxx_global_var_init_2_9458"].apply(null, arguments)
            }, ___cxx_global_var_init_3096 = Module["___cxx_global_var_init_3096"] = function() {
                return Module["asm"]["___cxx_global_var_init_3096"].apply(null, arguments)
            }, ___cxx_global_var_init_4_834 = Module["___cxx_global_var_init_4_834"] = function() {
                return Module["asm"]["___cxx_global_var_init_4_834"].apply(null, arguments)
            }, ___cxx_global_var_init_51 = Module["___cxx_global_var_init_51"] = function() {
                return Module["asm"]["___cxx_global_var_init_51"].apply(null, arguments)
            }, ___cxx_global_var_init_66 = Module["___cxx_global_var_init_66"] = function() {
                return Module["asm"]["___cxx_global_var_init_66"].apply(null, arguments)
            }, ___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = function() {
                return Module["asm"]["___emscripten_environ_constructor"].apply(null, arguments)
            }, ___errno_location = Module["___errno_location"] = function() {
                return Module["asm"]["___errno_location"].apply(null, arguments)
            }, __get_daylight = Module["__get_daylight"] = function() {
                return Module["asm"]["__get_daylight"].apply(null, arguments)
            }, __get_environ = Module["__get_environ"] = function() {
                return Module["asm"]["__get_environ"].apply(null, arguments)
            }, __get_timezone = Module["__get_timezone"] = function() {
                return Module["asm"]["__get_timezone"].apply(null, arguments)
            }, __get_tzname = Module["__get_tzname"] = function() {
                return Module["asm"]["__get_tzname"].apply(null, arguments)
            }, _emscripten_replace_memory = Module["_emscripten_replace_memory"] = function() {
                return Module["asm"]["_emscripten_replace_memory"].apply(null, arguments)
            }, _free = Module["_free"] = function() {
                return Module["asm"]["_free"].apply(null, arguments)
            }, _htonl = Module["_htonl"] = function() {
                return Module["asm"]["_htonl"].apply(null, arguments)
            }, _htons = Module["_htons"] = function() {
                return Module["asm"]["_htons"].apply(null, arguments)
            }, _i64Add = Module["_i64Add"] = function() {
                return Module["asm"]["_i64Add"].apply(null, arguments)
            }, _llvm_bswap_i16 = Module["_llvm_bswap_i16"] = function() {
                return Module["asm"]["_llvm_bswap_i16"].apply(null, arguments)
            }, _llvm_bswap_i32 = Module["_llvm_bswap_i32"] = function() {
                return Module["asm"]["_llvm_bswap_i32"].apply(null, arguments)
            }, _llvm_ctlz_i64 = Module["_llvm_ctlz_i64"] = function() {
                return Module["asm"]["_llvm_ctlz_i64"].apply(null, arguments)
            }, _llvm_maxnum_f32 = Module["_llvm_maxnum_f32"] = function() {
                return Module["asm"]["_llvm_maxnum_f32"].apply(null, arguments)
            }, _llvm_maxnum_f64 = Module["_llvm_maxnum_f64"] = function() {
                return Module["asm"]["_llvm_maxnum_f64"].apply(null, arguments)
            }, _llvm_minnum_f32 = Module["_llvm_minnum_f32"] = function() {
                return Module["asm"]["_llvm_minnum_f32"].apply(null, arguments)
            }, _llvm_round_f32 = Module["_llvm_round_f32"] = function() {
                return Module["asm"]["_llvm_round_f32"].apply(null, arguments)
            }, _main = Module["_main"] = function() {
                return Module["asm"]["_main"].apply(null, arguments)
            }, _malloc = Module["_malloc"] = function() {
                return Module["asm"]["_malloc"].apply(null, arguments)
            }, _memalign = Module["_memalign"] = function() {
                return Module["asm"]["_memalign"].apply(null, arguments)
            }, _memcpy = Module["_memcpy"] = function() {
                return Module["asm"]["_memcpy"].apply(null, arguments)
            }, _memmove = Module["_memmove"] = function() {
                return Module["asm"]["_memmove"].apply(null, arguments)
            }, _memset = Module["_memset"] = function() {
                return Module["asm"]["_memset"].apply(null, arguments)
            }, _ntohs = Module["_ntohs"] = function() {
                return Module["asm"]["_ntohs"].apply(null, arguments)
            }, _pthread_cond_broadcast = Module["_pthread_cond_broadcast"] = function() {
                return Module["asm"]["_pthread_cond_broadcast"].apply(null, arguments)
            }, _pthread_mutex_lock = Module["_pthread_mutex_lock"] = function() {
                return Module["asm"]["_pthread_mutex_lock"].apply(null, arguments)
            }, _pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = function() {
                return Module["asm"]["_pthread_mutex_unlock"].apply(null, arguments)
            }, _realloc = Module["_realloc"] = function() {
                return Module["asm"]["_realloc"].apply(null, arguments)
            }, _saveSetjmp = Module["_saveSetjmp"] = function() {
                return Module["asm"]["_saveSetjmp"].apply(null, arguments)
            }, _sbrk = Module["_sbrk"] = function() {
                return Module["asm"]["_sbrk"].apply(null, arguments)
            }, _strlen = Module["_strlen"] = function() {
                return Module["asm"]["_strlen"].apply(null, arguments)
            }, _testSetjmp = Module["_testSetjmp"] = function() {
                return Module["asm"]["_testSetjmp"].apply(null, arguments)
            }, establishStackSpace = Module["establishStackSpace"] = function() {
                return Module["asm"]["establishStackSpace"].apply(null, arguments)
            }, getTempRet0 = Module["getTempRet0"] = function() {
                return Module["asm"]["getTempRet0"].apply(null, arguments)
            }, runPostSets = Module["runPostSets"] = function() {
                return Module["asm"]["runPostSets"].apply(null, arguments)
            }, setTempRet0 = Module["setTempRet0"] = function() {
                return Module["asm"]["setTempRet0"].apply(null, arguments)
            }, setThrew = Module["setThrew"] = function() {
                return Module["asm"]["setThrew"].apply(null, arguments)
            }, stackAlloc = Module["stackAlloc"] = function() {
                return Module["asm"]["stackAlloc"].apply(null, arguments)
            }, stackRestore = Module["stackRestore"] = function() {
                return Module["asm"]["stackRestore"].apply(null, arguments)
            }, stackSave = Module["stackSave"] = function() {
                return Module["asm"]["stackSave"].apply(null, arguments)
            }, dynCall_dd = Module["dynCall_dd"] = function() {
                return Module["asm"]["dynCall_dd"].apply(null, arguments)
            }, dynCall_ddd = Module["dynCall_ddd"] = function() {
                return Module["asm"]["dynCall_ddd"].apply(null, arguments)
            }, dynCall_ddddi = Module["dynCall_ddddi"] = function() {
                return Module["asm"]["dynCall_ddddi"].apply(null, arguments)
            }, dynCall_dddi = Module["dynCall_dddi"] = function() {
                return Module["asm"]["dynCall_dddi"].apply(null, arguments)
            }, dynCall_ddi = Module["dynCall_ddi"] = function() {
                return Module["asm"]["dynCall_ddi"].apply(null, arguments)
            }, dynCall_ddii = Module["dynCall_ddii"] = function() {
                return Module["asm"]["dynCall_ddii"].apply(null, arguments)
            }, dynCall_ddiii = Module["dynCall_ddiii"] = function() {
                return Module["asm"]["dynCall_ddiii"].apply(null, arguments)
            }, dynCall_dfi = Module["dynCall_dfi"] = function() {
                return Module["asm"]["dynCall_dfi"].apply(null, arguments)
            }, dynCall_di = Module["dynCall_di"] = function() {
                return Module["asm"]["dynCall_di"].apply(null, arguments)
            }, dynCall_diddi = Module["dynCall_diddi"] = function() {
                return Module["asm"]["dynCall_diddi"].apply(null, arguments)
            }, dynCall_didi = Module["dynCall_didi"] = function() {
                return Module["asm"]["dynCall_didi"].apply(null, arguments)
            }, dynCall_dii = Module["dynCall_dii"] = function() {
                return Module["asm"]["dynCall_dii"].apply(null, arguments)
            }, dynCall_diidi = Module["dynCall_diidi"] = function() {
                return Module["asm"]["dynCall_diidi"].apply(null, arguments)
            }, dynCall_diii = Module["dynCall_diii"] = function() {
                return Module["asm"]["dynCall_diii"].apply(null, arguments)
            }, dynCall_diiii = Module["dynCall_diiii"] = function() {
                return Module["asm"]["dynCall_diiii"].apply(null, arguments)
            }, dynCall_dji = Module["dynCall_dji"] = function() {
                return Module["asm"]["dynCall_dji"].apply(null, arguments)
            }, dynCall_f = Module["dynCall_f"] = function() {
                return Module["asm"]["dynCall_f"].apply(null, arguments)
            }, dynCall_fdi = Module["dynCall_fdi"] = function() {
                return Module["asm"]["dynCall_fdi"].apply(null, arguments)
            }, dynCall_ff = Module["dynCall_ff"] = function() {
                return Module["asm"]["dynCall_ff"].apply(null, arguments)
            }, dynCall_fff = Module["dynCall_fff"] = function() {
                return Module["asm"]["dynCall_fff"].apply(null, arguments)
            }, dynCall_ffffffi = Module["dynCall_ffffffi"] = function() {
                return Module["asm"]["dynCall_ffffffi"].apply(null, arguments)
            }, dynCall_fffffi = Module["dynCall_fffffi"] = function() {
                return Module["asm"]["dynCall_fffffi"].apply(null, arguments)
            }, dynCall_ffffi = Module["dynCall_ffffi"] = function() {
                return Module["asm"]["dynCall_ffffi"].apply(null, arguments)
            }, dynCall_ffffii = Module["dynCall_ffffii"] = function() {
                return Module["asm"]["dynCall_ffffii"].apply(null, arguments)
            }, dynCall_fffi = Module["dynCall_fffi"] = function() {
                return Module["asm"]["dynCall_fffi"].apply(null, arguments)
            }, dynCall_fffifffi = Module["dynCall_fffifffi"] = function() {
                return Module["asm"]["dynCall_fffifffi"].apply(null, arguments)
            }, dynCall_fffifi = Module["dynCall_fffifi"] = function() {
                return Module["asm"]["dynCall_fffifi"].apply(null, arguments)
            }, dynCall_ffi = Module["dynCall_ffi"] = function() {
                return Module["asm"]["dynCall_ffi"].apply(null, arguments)
            }, dynCall_ffii = Module["dynCall_ffii"] = function() {
                return Module["asm"]["dynCall_ffii"].apply(null, arguments)
            }, dynCall_fi = Module["dynCall_fi"] = function() {
                return Module["asm"]["dynCall_fi"].apply(null, arguments)
            }, dynCall_fif = Module["dynCall_fif"] = function() {
                return Module["asm"]["dynCall_fif"].apply(null, arguments)
            }, dynCall_fiff = Module["dynCall_fiff"] = function() {
                return Module["asm"]["dynCall_fiff"].apply(null, arguments)
            }, dynCall_fiffffii = Module["dynCall_fiffffii"] = function() {
                return Module["asm"]["dynCall_fiffffii"].apply(null, arguments)
            }, dynCall_fiffffiiiii = Module["dynCall_fiffffiiiii"] = function() {
                return Module["asm"]["dynCall_fiffffiiiii"].apply(null, arguments)
            }, dynCall_fiffffiiiiii = Module["dynCall_fiffffiiiiii"] = function() {
                return Module["asm"]["dynCall_fiffffiiiiii"].apply(null, arguments)
            }, dynCall_fifffi = Module["dynCall_fifffi"] = function() {
                return Module["asm"]["dynCall_fifffi"].apply(null, arguments)
            }, dynCall_fiffi = Module["dynCall_fiffi"] = function() {
                return Module["asm"]["dynCall_fiffi"].apply(null, arguments)
            }, dynCall_fifi = Module["dynCall_fifi"] = function() {
                return Module["asm"]["dynCall_fifi"].apply(null, arguments)
            }, dynCall_fifii = Module["dynCall_fifii"] = function() {
                return Module["asm"]["dynCall_fifii"].apply(null, arguments)
            }, dynCall_fifiii = Module["dynCall_fifiii"] = function() {
                return Module["asm"]["dynCall_fifiii"].apply(null, arguments)
            }, dynCall_fii = Module["dynCall_fii"] = function() {
                return Module["asm"]["dynCall_fii"].apply(null, arguments)
            }, dynCall_fiif = Module["dynCall_fiif"] = function() {
                return Module["asm"]["dynCall_fiif"].apply(null, arguments)
            }, dynCall_fiifi = Module["dynCall_fiifi"] = function() {
                return Module["asm"]["dynCall_fiifi"].apply(null, arguments)
            }, dynCall_fiifii = Module["dynCall_fiifii"] = function() {
                return Module["asm"]["dynCall_fiifii"].apply(null, arguments)
            }, dynCall_fiii = Module["dynCall_fiii"] = function() {
                return Module["asm"]["dynCall_fiii"].apply(null, arguments)
            }, dynCall_fiiifi = Module["dynCall_fiiifi"] = function() {
                return Module["asm"]["dynCall_fiiifi"].apply(null, arguments)
            }, dynCall_fiiii = Module["dynCall_fiiii"] = function() {
                return Module["asm"]["dynCall_fiiii"].apply(null, arguments)
            }, dynCall_fiiiif = Module["dynCall_fiiiif"] = function() {
                return Module["asm"]["dynCall_fiiiif"].apply(null, arguments)
            }, dynCall_fiiiiiifiifif = Module["dynCall_fiiiiiifiifif"] = function() {
                return Module["asm"]["dynCall_fiiiiiifiifif"].apply(null, arguments)
            }, dynCall_fiiiiiifiiiif = Module["dynCall_fiiiiiifiiiif"] = function() {
                return Module["asm"]["dynCall_fiiiiiifiiiif"].apply(null, arguments)
            }, dynCall_fji = Module["dynCall_fji"] = function() {
                return Module["asm"]["dynCall_fji"].apply(null, arguments)
            }, dynCall_i = Module["dynCall_i"] = function() {
                return Module["asm"]["dynCall_i"].apply(null, arguments)
            }, dynCall_idi = Module["dynCall_idi"] = function() {
                return Module["asm"]["dynCall_idi"].apply(null, arguments)
            }, dynCall_idiii = Module["dynCall_idiii"] = function() {
                return Module["asm"]["dynCall_idiii"].apply(null, arguments)
            }, dynCall_iffffi = Module["dynCall_iffffi"] = function() {
                return Module["asm"]["dynCall_iffffi"].apply(null, arguments)
            }, dynCall_ifffi = Module["dynCall_ifffi"] = function() {
                return Module["asm"]["dynCall_ifffi"].apply(null, arguments)
            }, dynCall_ifffii = Module["dynCall_ifffii"] = function() {
                return Module["asm"]["dynCall_ifffii"].apply(null, arguments)
            }, dynCall_ifffiii = Module["dynCall_ifffiii"] = function() {
                return Module["asm"]["dynCall_ifffiii"].apply(null, arguments)
            }, dynCall_iffi = Module["dynCall_iffi"] = function() {
                return Module["asm"]["dynCall_iffi"].apply(null, arguments)
            }, dynCall_ifi = Module["dynCall_ifi"] = function() {
                return Module["asm"]["dynCall_ifi"].apply(null, arguments)
            }, dynCall_ifii = Module["dynCall_ifii"] = function() {
                return Module["asm"]["dynCall_ifii"].apply(null, arguments)
            }, dynCall_ifiii = Module["dynCall_ifiii"] = function() {
                return Module["asm"]["dynCall_ifiii"].apply(null, arguments)
            }, dynCall_ii = Module["dynCall_ii"] = function() {
                return Module["asm"]["dynCall_ii"].apply(null, arguments)
            }, dynCall_iiddi = Module["dynCall_iiddi"] = function() {
                return Module["asm"]["dynCall_iiddi"].apply(null, arguments)
            }, dynCall_iidi = Module["dynCall_iidi"] = function() {
                return Module["asm"]["dynCall_iidi"].apply(null, arguments)
            }, dynCall_iidii = Module["dynCall_iidii"] = function() {
                return Module["asm"]["dynCall_iidii"].apply(null, arguments)
            }, dynCall_iif = Module["dynCall_iif"] = function() {
                return Module["asm"]["dynCall_iif"].apply(null, arguments)
            }, dynCall_iiff = Module["dynCall_iiff"] = function() {
                return Module["asm"]["dynCall_iiff"].apply(null, arguments)
            }, dynCall_iifff = Module["dynCall_iifff"] = function() {
                return Module["asm"]["dynCall_iifff"].apply(null, arguments)
            }, dynCall_iifffi = Module["dynCall_iifffi"] = function() {
                return Module["asm"]["dynCall_iifffi"].apply(null, arguments)
            }, dynCall_iiffi = Module["dynCall_iiffi"] = function() {
                return Module["asm"]["dynCall_iiffi"].apply(null, arguments)
            }, dynCall_iiffii = Module["dynCall_iiffii"] = function() {
                return Module["asm"]["dynCall_iiffii"].apply(null, arguments)
            }, dynCall_iiffiii = Module["dynCall_iiffiii"] = function() {
                return Module["asm"]["dynCall_iiffiii"].apply(null, arguments)
            }, dynCall_iifi = Module["dynCall_iifi"] = function() {
                return Module["asm"]["dynCall_iifi"].apply(null, arguments)
            }, dynCall_iififiii = Module["dynCall_iififiii"] = function() {
                return Module["asm"]["dynCall_iififiii"].apply(null, arguments)
            }, dynCall_iifii = Module["dynCall_iifii"] = function() {
                return Module["asm"]["dynCall_iifii"].apply(null, arguments)
            }, dynCall_iifiii = Module["dynCall_iifiii"] = function() {
                return Module["asm"]["dynCall_iifiii"].apply(null, arguments)
            }, dynCall_iifiiii = Module["dynCall_iifiiii"] = function() {
                return Module["asm"]["dynCall_iifiiii"].apply(null, arguments)
            }, dynCall_iii = Module["dynCall_iii"] = function() {
                return Module["asm"]["dynCall_iii"].apply(null, arguments)
            }, dynCall_iiidii = Module["dynCall_iiidii"] = function() {
                return Module["asm"]["dynCall_iiidii"].apply(null, arguments)
            }, dynCall_iiif = Module["dynCall_iiif"] = function() {
                return Module["asm"]["dynCall_iiif"].apply(null, arguments)
            }, dynCall_iiifffffffi = Module["dynCall_iiifffffffi"] = function() {
                return Module["asm"]["dynCall_iiifffffffi"].apply(null, arguments)
            }, dynCall_iiiffffiii = Module["dynCall_iiiffffiii"] = function() {
                return Module["asm"]["dynCall_iiiffffiii"].apply(null, arguments)
            }, dynCall_iiifffi = Module["dynCall_iiifffi"] = function() {
                return Module["asm"]["dynCall_iiifffi"].apply(null, arguments)
            }, dynCall_iiifffii = Module["dynCall_iiifffii"] = function() {
                return Module["asm"]["dynCall_iiifffii"].apply(null, arguments)
            }, dynCall_iiiffi = Module["dynCall_iiiffi"] = function() {
                return Module["asm"]["dynCall_iiiffi"].apply(null, arguments)
            }, dynCall_iiiffii = Module["dynCall_iiiffii"] = function() {
                return Module["asm"]["dynCall_iiiffii"].apply(null, arguments)
            }, dynCall_iiiffiii = Module["dynCall_iiiffiii"] = function() {
                return Module["asm"]["dynCall_iiiffiii"].apply(null, arguments)
            }, dynCall_iiifi = Module["dynCall_iiifi"] = function() {
                return Module["asm"]["dynCall_iiifi"].apply(null, arguments)
            }, dynCall_iiifii = Module["dynCall_iiifii"] = function() {
                return Module["asm"]["dynCall_iiifii"].apply(null, arguments)
            }, dynCall_iiifiii = Module["dynCall_iiifiii"] = function() {
                return Module["asm"]["dynCall_iiifiii"].apply(null, arguments)
            }, dynCall_iiifiiii = Module["dynCall_iiifiiii"] = function() {
                return Module["asm"]["dynCall_iiifiiii"].apply(null, arguments)
            }, dynCall_iiii = Module["dynCall_iiii"] = function() {
                return Module["asm"]["dynCall_iiii"].apply(null, arguments)
            }, dynCall_iiiifffffi = Module["dynCall_iiiifffffi"] = function() {
                return Module["asm"]["dynCall_iiiifffffi"].apply(null, arguments)
            }, dynCall_iiiiffffiii = Module["dynCall_iiiiffffiii"] = function() {
                return Module["asm"]["dynCall_iiiiffffiii"].apply(null, arguments)
            }, dynCall_iiiiffi = Module["dynCall_iiiiffi"] = function() {
                return Module["asm"]["dynCall_iiiiffi"].apply(null, arguments)
            }, dynCall_iiiiffii = Module["dynCall_iiiiffii"] = function() {
                return Module["asm"]["dynCall_iiiiffii"].apply(null, arguments)
            }, dynCall_iiiifi = Module["dynCall_iiiifi"] = function() {
                return Module["asm"]["dynCall_iiiifi"].apply(null, arguments)
            }, dynCall_iiiifii = Module["dynCall_iiiifii"] = function() {
                return Module["asm"]["dynCall_iiiifii"].apply(null, arguments)
            }, dynCall_iiiifiii = Module["dynCall_iiiifiii"] = function() {
                return Module["asm"]["dynCall_iiiifiii"].apply(null, arguments)
            }, dynCall_iiiifiiii = Module["dynCall_iiiifiiii"] = function() {
                return Module["asm"]["dynCall_iiiifiiii"].apply(null, arguments)
            }, dynCall_iiiifiiiii = Module["dynCall_iiiifiiiii"] = function() {
                return Module["asm"]["dynCall_iiiifiiiii"].apply(null, arguments)
            }, dynCall_iiiii = Module["dynCall_iiiii"] = function() {
                return Module["asm"]["dynCall_iiiii"].apply(null, arguments)
            }, dynCall_iiiiiffii = Module["dynCall_iiiiiffii"] = function() {
                return Module["asm"]["dynCall_iiiiiffii"].apply(null, arguments)
            }, dynCall_iiiiifi = Module["dynCall_iiiiifi"] = function() {
                return Module["asm"]["dynCall_iiiiifi"].apply(null, arguments)
            }, dynCall_iiiiifii = Module["dynCall_iiiiifii"] = function() {
                return Module["asm"]["dynCall_iiiiifii"].apply(null, arguments)
            }, dynCall_iiiiifiii = Module["dynCall_iiiiifiii"] = function() {
                return Module["asm"]["dynCall_iiiiifiii"].apply(null, arguments)
            }, dynCall_iiiiifiiiif = Module["dynCall_iiiiifiiiif"] = function() {
                return Module["asm"]["dynCall_iiiiifiiiif"].apply(null, arguments)
            }, dynCall_iiiiifiiiiif = Module["dynCall_iiiiifiiiiif"] = function() {
                return Module["asm"]["dynCall_iiiiifiiiiif"].apply(null, arguments)
            }, dynCall_iiiiii = Module["dynCall_iiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiii"].apply(null, arguments)
            }, dynCall_iiiiiifffi = Module["dynCall_iiiiiifffi"] = function() {
                return Module["asm"]["dynCall_iiiiiifffi"].apply(null, arguments)
            }, dynCall_iiiiiifffiiifiii = Module["dynCall_iiiiiifffiiifiii"] = function() {
                return Module["asm"]["dynCall_iiiiiifffiiifiii"].apply(null, arguments)
            }, dynCall_iiiiiiffiiiiiiiiiffffiii = Module["dynCall_iiiiiiffiiiiiiiiiffffiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiffiiiiiiiiiffffiii"].apply(null, arguments)
            }, dynCall_iiiiiiffiiiiiiiiiffffiiii = Module["dynCall_iiiiiiffiiiiiiiiiffffiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiffiiiiiiiiiffffiiii"].apply(null, arguments)
            }, dynCall_iiiiiiffiiiiiiiiiiiiiii = Module["dynCall_iiiiiiffiiiiiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiffiiiiiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_iiiiiifiif = Module["dynCall_iiiiiifiif"] = function() {
                return Module["asm"]["dynCall_iiiiiifiif"].apply(null, arguments)
            }, dynCall_iiiiiifiii = Module["dynCall_iiiiiifiii"] = function() {
                return Module["asm"]["dynCall_iiiiiifiii"].apply(null, arguments)
            }, dynCall_iiiiiii = Module["dynCall_iiiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiii"].apply(null, arguments)
            }, dynCall_iiiiiiifi = Module["dynCall_iiiiiiifi"] = function() {
                return Module["asm"]["dynCall_iiiiiiifi"].apply(null, arguments)
            }, dynCall_iiiiiiifii = Module["dynCall_iiiiiiifii"] = function() {
                return Module["asm"]["dynCall_iiiiiiifii"].apply(null, arguments)
            }, dynCall_iiiiiiifiif = Module["dynCall_iiiiiiifiif"] = function() {
                return Module["asm"]["dynCall_iiiiiiifiif"].apply(null, arguments)
            }, dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiii"].apply(null, arguments)
            }, dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiiii"].apply(null, arguments)
            }, dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiiiii"].apply(null, arguments)
            }, dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiiiiii"].apply(null, arguments)
            }, dynCall_iiiiiiiiiiii = Module["dynCall_iiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_iiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_iiiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_iiiiiiijjiii = Module["dynCall_iiiiiiijjiii"] = function() {
                return Module["asm"]["dynCall_iiiiiiijjiii"].apply(null, arguments)
            }, dynCall_iiiiiijjiii = Module["dynCall_iiiiiijjiii"] = function() {
                return Module["asm"]["dynCall_iiiiiijjiii"].apply(null, arguments)
            }, dynCall_iiiiij = Module["dynCall_iiiiij"] = function() {
                return Module["asm"]["dynCall_iiiiij"].apply(null, arguments)
            }, dynCall_iiiiiji = Module["dynCall_iiiiiji"] = function() {
                return Module["asm"]["dynCall_iiiiiji"].apply(null, arguments)
            }, dynCall_iiiiijiiii = Module["dynCall_iiiiijiiii"] = function() {
                return Module["asm"]["dynCall_iiiiijiiii"].apply(null, arguments)
            }, dynCall_iiiij = Module["dynCall_iiiij"] = function() {
                return Module["asm"]["dynCall_iiiij"].apply(null, arguments)
            }, dynCall_iiiiji = Module["dynCall_iiiiji"] = function() {
                return Module["asm"]["dynCall_iiiiji"].apply(null, arguments)
            }, dynCall_iiiijii = Module["dynCall_iiiijii"] = function() {
                return Module["asm"]["dynCall_iiiijii"].apply(null, arguments)
            }, dynCall_iiiijjii = Module["dynCall_iiiijjii"] = function() {
                return Module["asm"]["dynCall_iiiijjii"].apply(null, arguments)
            }, dynCall_iiiijjiiii = Module["dynCall_iiiijjiiii"] = function() {
                return Module["asm"]["dynCall_iiiijjiiii"].apply(null, arguments)
            }, dynCall_iiij = Module["dynCall_iiij"] = function() {
                return Module["asm"]["dynCall_iiij"].apply(null, arguments)
            }, dynCall_iiiji = Module["dynCall_iiiji"] = function() {
                return Module["asm"]["dynCall_iiiji"].apply(null, arguments)
            }, dynCall_iiijii = Module["dynCall_iiijii"] = function() {
                return Module["asm"]["dynCall_iiijii"].apply(null, arguments)
            }, dynCall_iiijiii = Module["dynCall_iiijiii"] = function() {
                return Module["asm"]["dynCall_iiijiii"].apply(null, arguments)
            }, dynCall_iiijji = Module["dynCall_iiijji"] = function() {
                return Module["asm"]["dynCall_iiijji"].apply(null, arguments)
            }, dynCall_iiijjii = Module["dynCall_iiijjii"] = function() {
                return Module["asm"]["dynCall_iiijjii"].apply(null, arguments)
            }, dynCall_iiijjiiii = Module["dynCall_iiijjiiii"] = function() {
                return Module["asm"]["dynCall_iiijjiiii"].apply(null, arguments)
            }, dynCall_iiijjjiii = Module["dynCall_iiijjjiii"] = function() {
                return Module["asm"]["dynCall_iiijjjiii"].apply(null, arguments)
            }, dynCall_iij = Module["dynCall_iij"] = function() {
                return Module["asm"]["dynCall_iij"].apply(null, arguments)
            }, dynCall_iiji = Module["dynCall_iiji"] = function() {
                return Module["asm"]["dynCall_iiji"].apply(null, arguments)
            }, dynCall_iijii = Module["dynCall_iijii"] = function() {
                return Module["asm"]["dynCall_iijii"].apply(null, arguments)
            }, dynCall_iijiii = Module["dynCall_iijiii"] = function() {
                return Module["asm"]["dynCall_iijiii"].apply(null, arguments)
            }, dynCall_iijiiii = Module["dynCall_iijiiii"] = function() {
                return Module["asm"]["dynCall_iijiiii"].apply(null, arguments)
            }, dynCall_iijiiiiiii = Module["dynCall_iijiiiiiii"] = function() {
                return Module["asm"]["dynCall_iijiiiiiii"].apply(null, arguments)
            }, dynCall_iijji = Module["dynCall_iijji"] = function() {
                return Module["asm"]["dynCall_iijji"].apply(null, arguments)
            }, dynCall_iijjii = Module["dynCall_iijjii"] = function() {
                return Module["asm"]["dynCall_iijjii"].apply(null, arguments)
            }, dynCall_iijjiii = Module["dynCall_iijjiii"] = function() {
                return Module["asm"]["dynCall_iijjiii"].apply(null, arguments)
            }, dynCall_iijjji = Module["dynCall_iijjji"] = function() {
                return Module["asm"]["dynCall_iijjji"].apply(null, arguments)
            }, dynCall_iijjjii = Module["dynCall_iijjjii"] = function() {
                return Module["asm"]["dynCall_iijjjii"].apply(null, arguments)
            }, dynCall_ij = Module["dynCall_ij"] = function() {
                return Module["asm"]["dynCall_ij"].apply(null, arguments)
            }, dynCall_iji = Module["dynCall_iji"] = function() {
                return Module["asm"]["dynCall_iji"].apply(null, arguments)
            }, dynCall_ijiii = Module["dynCall_ijiii"] = function() {
                return Module["asm"]["dynCall_ijiii"].apply(null, arguments)
            }, dynCall_ijj = Module["dynCall_ijj"] = function() {
                return Module["asm"]["dynCall_ijj"].apply(null, arguments)
            }, dynCall_ijji = Module["dynCall_ijji"] = function() {
                return Module["asm"]["dynCall_ijji"].apply(null, arguments)
            }, dynCall_j = Module["dynCall_j"] = function() {
                return Module["asm"]["dynCall_j"].apply(null, arguments)
            }, dynCall_jdi = Module["dynCall_jdi"] = function() {
                return Module["asm"]["dynCall_jdi"].apply(null, arguments)
            }, dynCall_jdii = Module["dynCall_jdii"] = function() {
                return Module["asm"]["dynCall_jdii"].apply(null, arguments)
            }, dynCall_jfi = Module["dynCall_jfi"] = function() {
                return Module["asm"]["dynCall_jfi"].apply(null, arguments)
            }, dynCall_ji = Module["dynCall_ji"] = function() {
                return Module["asm"]["dynCall_ji"].apply(null, arguments)
            }, dynCall_jidi = Module["dynCall_jidi"] = function() {
                return Module["asm"]["dynCall_jidi"].apply(null, arguments)
            }, dynCall_jidii = Module["dynCall_jidii"] = function() {
                return Module["asm"]["dynCall_jidii"].apply(null, arguments)
            }, dynCall_jii = Module["dynCall_jii"] = function() {
                return Module["asm"]["dynCall_jii"].apply(null, arguments)
            }, dynCall_jiii = Module["dynCall_jiii"] = function() {
                return Module["asm"]["dynCall_jiii"].apply(null, arguments)
            }, dynCall_jiiii = Module["dynCall_jiiii"] = function() {
                return Module["asm"]["dynCall_jiiii"].apply(null, arguments)
            }, dynCall_jiiiii = Module["dynCall_jiiiii"] = function() {
                return Module["asm"]["dynCall_jiiiii"].apply(null, arguments)
            }, dynCall_jiiiiii = Module["dynCall_jiiiiii"] = function() {
                return Module["asm"]["dynCall_jiiiiii"].apply(null, arguments)
            }, dynCall_jiiiiiiiiii = Module["dynCall_jiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_jiiiiiiiiii"].apply(null, arguments)
            }, dynCall_jiiji = Module["dynCall_jiiji"] = function() {
                return Module["asm"]["dynCall_jiiji"].apply(null, arguments)
            }, dynCall_jiijii = Module["dynCall_jiijii"] = function() {
                return Module["asm"]["dynCall_jiijii"].apply(null, arguments)
            }, dynCall_jiji = Module["dynCall_jiji"] = function() {
                return Module["asm"]["dynCall_jiji"].apply(null, arguments)
            }, dynCall_jijii = Module["dynCall_jijii"] = function() {
                return Module["asm"]["dynCall_jijii"].apply(null, arguments)
            }, dynCall_jijiii = Module["dynCall_jijiii"] = function() {
                return Module["asm"]["dynCall_jijiii"].apply(null, arguments)
            }, dynCall_jijj = Module["dynCall_jijj"] = function() {
                return Module["asm"]["dynCall_jijj"].apply(null, arguments)
            }, dynCall_jijji = Module["dynCall_jijji"] = function() {
                return Module["asm"]["dynCall_jijji"].apply(null, arguments)
            }, dynCall_jj = Module["dynCall_jj"] = function() {
                return Module["asm"]["dynCall_jj"].apply(null, arguments)
            }, dynCall_jji = Module["dynCall_jji"] = function() {
                return Module["asm"]["dynCall_jji"].apply(null, arguments)
            }, dynCall_jjii = Module["dynCall_jjii"] = function() {
                return Module["asm"]["dynCall_jjii"].apply(null, arguments)
            }, dynCall_jjjji = Module["dynCall_jjjji"] = function() {
                return Module["asm"]["dynCall_jjjji"].apply(null, arguments)
            }, dynCall_v = Module["dynCall_v"] = function() {
                return Module["asm"]["dynCall_v"].apply(null, arguments)
            }, dynCall_vd = Module["dynCall_vd"] = function() {
                return Module["asm"]["dynCall_vd"].apply(null, arguments)
            }, dynCall_vdii = Module["dynCall_vdii"] = function() {
                return Module["asm"]["dynCall_vdii"].apply(null, arguments)
            }, dynCall_vf = Module["dynCall_vf"] = function() {
                return Module["asm"]["dynCall_vf"].apply(null, arguments)
            }, dynCall_vff = Module["dynCall_vff"] = function() {
                return Module["asm"]["dynCall_vff"].apply(null, arguments)
            }, dynCall_vfff = Module["dynCall_vfff"] = function() {
                return Module["asm"]["dynCall_vfff"].apply(null, arguments)
            }, dynCall_vffff = Module["dynCall_vffff"] = function() {
                return Module["asm"]["dynCall_vffff"].apply(null, arguments)
            }, dynCall_vffffi = Module["dynCall_vffffi"] = function() {
                return Module["asm"]["dynCall_vffffi"].apply(null, arguments)
            }, dynCall_vfffi = Module["dynCall_vfffi"] = function() {
                return Module["asm"]["dynCall_vfffi"].apply(null, arguments)
            }, dynCall_vfi = Module["dynCall_vfi"] = function() {
                return Module["asm"]["dynCall_vfi"].apply(null, arguments)
            }, dynCall_vfif = Module["dynCall_vfif"] = function() {
                return Module["asm"]["dynCall_vfif"].apply(null, arguments)
            }, dynCall_vfifi = Module["dynCall_vfifi"] = function() {
                return Module["asm"]["dynCall_vfifi"].apply(null, arguments)
            }, dynCall_vfii = Module["dynCall_vfii"] = function() {
                return Module["asm"]["dynCall_vfii"].apply(null, arguments)
            }, dynCall_vfiii = Module["dynCall_vfiii"] = function() {
                return Module["asm"]["dynCall_vfiii"].apply(null, arguments)
            }, dynCall_vi = Module["dynCall_vi"] = function() {
                return Module["asm"]["dynCall_vi"].apply(null, arguments)
            }, dynCall_vid = Module["dynCall_vid"] = function() {
                return Module["asm"]["dynCall_vid"].apply(null, arguments)
            }, dynCall_vidd = Module["dynCall_vidd"] = function() {
                return Module["asm"]["dynCall_vidd"].apply(null, arguments)
            }, dynCall_viddi = Module["dynCall_viddi"] = function() {
                return Module["asm"]["dynCall_viddi"].apply(null, arguments)
            }, dynCall_vidi = Module["dynCall_vidi"] = function() {
                return Module["asm"]["dynCall_vidi"].apply(null, arguments)
            }, dynCall_vif = Module["dynCall_vif"] = function() {
                return Module["asm"]["dynCall_vif"].apply(null, arguments)
            }, dynCall_viff = Module["dynCall_viff"] = function() {
                return Module["asm"]["dynCall_viff"].apply(null, arguments)
            }, dynCall_vifff = Module["dynCall_vifff"] = function() {
                return Module["asm"]["dynCall_vifff"].apply(null, arguments)
            }, dynCall_viffff = Module["dynCall_viffff"] = function() {
                return Module["asm"]["dynCall_viffff"].apply(null, arguments)
            }, dynCall_viffffffi = Module["dynCall_viffffffi"] = function() {
                return Module["asm"]["dynCall_viffffffi"].apply(null, arguments)
            }, dynCall_viffffi = Module["dynCall_viffffi"] = function() {
                return Module["asm"]["dynCall_viffffi"].apply(null, arguments)
            }, dynCall_viffffii = Module["dynCall_viffffii"] = function() {
                return Module["asm"]["dynCall_viffffii"].apply(null, arguments)
            }, dynCall_viffffiii = Module["dynCall_viffffiii"] = function() {
                return Module["asm"]["dynCall_viffffiii"].apply(null, arguments)
            }, dynCall_viffffiiiii = Module["dynCall_viffffiiiii"] = function() {
                return Module["asm"]["dynCall_viffffiiiii"].apply(null, arguments)
            }, dynCall_vifffi = Module["dynCall_vifffi"] = function() {
                return Module["asm"]["dynCall_vifffi"].apply(null, arguments)
            }, dynCall_vifffii = Module["dynCall_vifffii"] = function() {
                return Module["asm"]["dynCall_vifffii"].apply(null, arguments)
            }, dynCall_viffi = Module["dynCall_viffi"] = function() {
                return Module["asm"]["dynCall_viffi"].apply(null, arguments)
            }, dynCall_viffii = Module["dynCall_viffii"] = function() {
                return Module["asm"]["dynCall_viffii"].apply(null, arguments)
            }, dynCall_viffiii = Module["dynCall_viffiii"] = function() {
                return Module["asm"]["dynCall_viffiii"].apply(null, arguments)
            }, dynCall_vifi = Module["dynCall_vifi"] = function() {
                return Module["asm"]["dynCall_vifi"].apply(null, arguments)
            }, dynCall_vififi = Module["dynCall_vififi"] = function() {
                return Module["asm"]["dynCall_vififi"].apply(null, arguments)
            }, dynCall_vififififii = Module["dynCall_vififififii"] = function() {
                return Module["asm"]["dynCall_vififififii"].apply(null, arguments)
            }, dynCall_vifii = Module["dynCall_vifii"] = function() {
                return Module["asm"]["dynCall_vifii"].apply(null, arguments)
            }, dynCall_vifiii = Module["dynCall_vifiii"] = function() {
                return Module["asm"]["dynCall_vifiii"].apply(null, arguments)
            }, dynCall_vifiiii = Module["dynCall_vifiiii"] = function() {
                return Module["asm"]["dynCall_vifiiii"].apply(null, arguments)
            }, dynCall_vii = Module["dynCall_vii"] = function() {
                return Module["asm"]["dynCall_vii"].apply(null, arguments)
            }, dynCall_viid = Module["dynCall_viid"] = function() {
                return Module["asm"]["dynCall_viid"].apply(null, arguments)
            }, dynCall_viiddi = Module["dynCall_viiddi"] = function() {
                return Module["asm"]["dynCall_viiddi"].apply(null, arguments)
            }, dynCall_viidi = Module["dynCall_viidi"] = function() {
                return Module["asm"]["dynCall_viidi"].apply(null, arguments)
            }, dynCall_viidii = Module["dynCall_viidii"] = function() {
                return Module["asm"]["dynCall_viidii"].apply(null, arguments)
            }, dynCall_viif = Module["dynCall_viif"] = function() {
                return Module["asm"]["dynCall_viif"].apply(null, arguments)
            }, dynCall_viiff = Module["dynCall_viiff"] = function() {
                return Module["asm"]["dynCall_viiff"].apply(null, arguments)
            }, dynCall_viifff = Module["dynCall_viifff"] = function() {
                return Module["asm"]["dynCall_viifff"].apply(null, arguments)
            }, dynCall_viiffffffi = Module["dynCall_viiffffffi"] = function() {
                return Module["asm"]["dynCall_viiffffffi"].apply(null, arguments)
            }, dynCall_viiffffi = Module["dynCall_viiffffi"] = function() {
                return Module["asm"]["dynCall_viiffffi"].apply(null, arguments)
            }, dynCall_viiffffii = Module["dynCall_viiffffii"] = function() {
                return Module["asm"]["dynCall_viiffffii"].apply(null, arguments)
            }, dynCall_viiffffiiiii = Module["dynCall_viiffffiiiii"] = function() {
                return Module["asm"]["dynCall_viiffffiiiii"].apply(null, arguments);
            }, dynCall_viifffi = Module["dynCall_viifffi"] = function() {
                return Module["asm"]["dynCall_viifffi"].apply(null, arguments)
            }, dynCall_viifffiiii = Module["dynCall_viifffiiii"] = function() {
                return Module["asm"]["dynCall_viifffiiii"].apply(null, arguments)
            }, dynCall_viiffi = Module["dynCall_viiffi"] = function() {
                return Module["asm"]["dynCall_viiffi"].apply(null, arguments)
            }, dynCall_viiffii = Module["dynCall_viiffii"] = function() {
                return Module["asm"]["dynCall_viiffii"].apply(null, arguments)
            }, dynCall_viiffiii = Module["dynCall_viiffiii"] = function() {
                return Module["asm"]["dynCall_viiffiii"].apply(null, arguments)
            }, dynCall_viiffiiiii = Module["dynCall_viiffiiiii"] = function() {
                return Module["asm"]["dynCall_viiffiiiii"].apply(null, arguments)
            }, dynCall_viifi = Module["dynCall_viifi"] = function() {
                return Module["asm"]["dynCall_viifi"].apply(null, arguments)
            }, dynCall_viififififii = Module["dynCall_viififififii"] = function() {
                return Module["asm"]["dynCall_viififififii"].apply(null, arguments)
            }, dynCall_viifii = Module["dynCall_viifii"] = function() {
                return Module["asm"]["dynCall_viifii"].apply(null, arguments)
            }, dynCall_viifiii = Module["dynCall_viifiii"] = function() {
                return Module["asm"]["dynCall_viifiii"].apply(null, arguments)
            }, dynCall_viifiiii = Module["dynCall_viifiiii"] = function() {
                return Module["asm"]["dynCall_viifiiii"].apply(null, arguments)
            }, dynCall_viii = Module["dynCall_viii"] = function() {
                return Module["asm"]["dynCall_viii"].apply(null, arguments)
            }, dynCall_viiidi = Module["dynCall_viiidi"] = function() {
                return Module["asm"]["dynCall_viiidi"].apply(null, arguments)
            }, dynCall_viiif = Module["dynCall_viiif"] = function() {
                return Module["asm"]["dynCall_viiif"].apply(null, arguments)
            }, dynCall_viiiffffffffii = Module["dynCall_viiiffffffffii"] = function() {
                return Module["asm"]["dynCall_viiiffffffffii"].apply(null, arguments)
            }, dynCall_viiifffi = Module["dynCall_viiifffi"] = function() {
                return Module["asm"]["dynCall_viiifffi"].apply(null, arguments)
            }, dynCall_viiiffi = Module["dynCall_viiiffi"] = function() {
                return Module["asm"]["dynCall_viiiffi"].apply(null, arguments)
            }, dynCall_viiiffii = Module["dynCall_viiiffii"] = function() {
                return Module["asm"]["dynCall_viiiffii"].apply(null, arguments)
            }, dynCall_viiifi = Module["dynCall_viiifi"] = function() {
                return Module["asm"]["dynCall_viiifi"].apply(null, arguments)
            }, dynCall_viiififfi = Module["dynCall_viiififfi"] = function() {
                return Module["asm"]["dynCall_viiififfi"].apply(null, arguments)
            }, dynCall_viiififi = Module["dynCall_viiififi"] = function() {
                return Module["asm"]["dynCall_viiififi"].apply(null, arguments)
            }, dynCall_viiifii = Module["dynCall_viiifii"] = function() {
                return Module["asm"]["dynCall_viiifii"].apply(null, arguments)
            }, dynCall_viiifiii = Module["dynCall_viiifiii"] = function() {
                return Module["asm"]["dynCall_viiifiii"].apply(null, arguments)
            }, dynCall_viiifiiiii = Module["dynCall_viiifiiiii"] = function() {
                return Module["asm"]["dynCall_viiifiiiii"].apply(null, arguments)
            }, dynCall_viiii = Module["dynCall_viiii"] = function() {
                return Module["asm"]["dynCall_viiii"].apply(null, arguments)
            }, dynCall_viiiif = Module["dynCall_viiiif"] = function() {
                return Module["asm"]["dynCall_viiiif"].apply(null, arguments)
            }, dynCall_viiiiffi = Module["dynCall_viiiiffi"] = function() {
                return Module["asm"]["dynCall_viiiiffi"].apply(null, arguments)
            }, dynCall_viiiiffii = Module["dynCall_viiiiffii"] = function() {
                return Module["asm"]["dynCall_viiiiffii"].apply(null, arguments)
            }, dynCall_viiiifi = Module["dynCall_viiiifi"] = function() {
                return Module["asm"]["dynCall_viiiifi"].apply(null, arguments)
            }, dynCall_viiiifii = Module["dynCall_viiiifii"] = function() {
                return Module["asm"]["dynCall_viiiifii"].apply(null, arguments)
            }, dynCall_viiiifiiii = Module["dynCall_viiiifiiii"] = function() {
                return Module["asm"]["dynCall_viiiifiiii"].apply(null, arguments)
            }, dynCall_viiiifiiiiif = Module["dynCall_viiiifiiiiif"] = function() {
                return Module["asm"]["dynCall_viiiifiiiiif"].apply(null, arguments)
            }, dynCall_viiiii = Module["dynCall_viiiii"] = function() {
                return Module["asm"]["dynCall_viiiii"].apply(null, arguments)
            }, dynCall_viiiiif = Module["dynCall_viiiiif"] = function() {
                return Module["asm"]["dynCall_viiiiif"].apply(null, arguments)
            }, dynCall_viiiiifffi = Module["dynCall_viiiiifffi"] = function() {
                return Module["asm"]["dynCall_viiiiifffi"].apply(null, arguments)
            }, dynCall_viiiiiffi = Module["dynCall_viiiiiffi"] = function() {
                return Module["asm"]["dynCall_viiiiiffi"].apply(null, arguments)
            }, dynCall_viiiiiffii = Module["dynCall_viiiiiffii"] = function() {
                return Module["asm"]["dynCall_viiiiiffii"].apply(null, arguments)
            }, dynCall_viiiiifi = Module["dynCall_viiiiifi"] = function() {
                return Module["asm"]["dynCall_viiiiifi"].apply(null, arguments)
            }, dynCall_viiiiii = Module["dynCall_viiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiii"].apply(null, arguments)
            }, dynCall_viiiiiif = Module["dynCall_viiiiiif"] = function() {
                return Module["asm"]["dynCall_viiiiiif"].apply(null, arguments)
            }, dynCall_viiiiiiffi = Module["dynCall_viiiiiiffi"] = function() {
                return Module["asm"]["dynCall_viiiiiiffi"].apply(null, arguments)
            }, dynCall_viiiiiii = Module["dynCall_viiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiifi = Module["dynCall_viiiiiiifi"] = function() {
                return Module["asm"]["dynCall_viiiiiiifi"].apply(null, arguments)
            }, dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiiifi = Module["dynCall_viiiiiiiifi"] = function() {
                return Module["asm"]["dynCall_viiiiiiiifi"].apply(null, arguments)
            }, dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiiiiiifii = Module["dynCall_viiiiiiiiiiifii"] = function() {
                return Module["asm"]["dynCall_viiiiiiiiiiifii"].apply(null, arguments)
            }, dynCall_viiiiiiiiiiii = Module["dynCall_viiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_viiiiiiiiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_viiiiiiiiiji = Module["dynCall_viiiiiiiiiji"] = function() {
                return Module["asm"]["dynCall_viiiiiiiiiji"].apply(null, arguments)
            }, dynCall_viiiijii = Module["dynCall_viiiijii"] = function() {
                return Module["asm"]["dynCall_viiiijii"].apply(null, arguments)
            }, dynCall_viiiijiiii = Module["dynCall_viiiijiiii"] = function() {
                return Module["asm"]["dynCall_viiiijiiii"].apply(null, arguments)
            }, dynCall_viiiijjiii = Module["dynCall_viiiijjiii"] = function() {
                return Module["asm"]["dynCall_viiiijjiii"].apply(null, arguments)
            }, dynCall_viiiji = Module["dynCall_viiiji"] = function() {
                return Module["asm"]["dynCall_viiiji"].apply(null, arguments)
            }, dynCall_viiijii = Module["dynCall_viiijii"] = function() {
                return Module["asm"]["dynCall_viiijii"].apply(null, arguments)
            }, dynCall_viiijiii = Module["dynCall_viiijiii"] = function() {
                return Module["asm"]["dynCall_viiijiii"].apply(null, arguments)
            }, dynCall_viiijiiifi = Module["dynCall_viiijiiifi"] = function() {
                return Module["asm"]["dynCall_viiijiiifi"].apply(null, arguments)
            }, dynCall_viiijiiijji = Module["dynCall_viiijiiijji"] = function() {
                return Module["asm"]["dynCall_viiijiiijji"].apply(null, arguments)
            }, dynCall_viiijji = Module["dynCall_viiijji"] = function() {
                return Module["asm"]["dynCall_viiijji"].apply(null, arguments)
            }, dynCall_viiijjii = Module["dynCall_viiijjii"] = function() {
                return Module["asm"]["dynCall_viiijjii"].apply(null, arguments)
            }, dynCall_viiijjiii = Module["dynCall_viiijjiii"] = function() {
                return Module["asm"]["dynCall_viiijjiii"].apply(null, arguments)
            }, dynCall_viiijjiijji = Module["dynCall_viiijjiijji"] = function() {
                return Module["asm"]["dynCall_viiijjiijji"].apply(null, arguments)
            }, dynCall_viiijjiijjji = Module["dynCall_viiijjiijjji"] = function() {
                return Module["asm"]["dynCall_viiijjiijjji"].apply(null, arguments)
            }, dynCall_viij = Module["dynCall_viij"] = function() {
                return Module["asm"]["dynCall_viij"].apply(null, arguments)
            }, dynCall_viiji = Module["dynCall_viiji"] = function() {
                return Module["asm"]["dynCall_viiji"].apply(null, arguments)
            }, dynCall_viijii = Module["dynCall_viijii"] = function() {
                return Module["asm"]["dynCall_viijii"].apply(null, arguments)
            }, dynCall_viijiii = Module["dynCall_viijiii"] = function() {
                return Module["asm"]["dynCall_viijiii"].apply(null, arguments)
            }, dynCall_viijiiiiiiiiiii = Module["dynCall_viijiiiiiiiiiii"] = function() {
                return Module["asm"]["dynCall_viijiiiiiiiiiii"].apply(null, arguments)
            }, dynCall_viijiiijji = Module["dynCall_viijiiijji"] = function() {
                return Module["asm"]["dynCall_viijiiijji"].apply(null, arguments)
            }, dynCall_viijiiijjji = Module["dynCall_viijiiijjji"] = function() {
                return Module["asm"]["dynCall_viijiiijjji"].apply(null, arguments)
            }, dynCall_viijiijiii = Module["dynCall_viijiijiii"] = function() {
                return Module["asm"]["dynCall_viijiijiii"].apply(null, arguments)
            }, dynCall_viijijii = Module["dynCall_viijijii"] = function() {
                return Module["asm"]["dynCall_viijijii"].apply(null, arguments)
            }, dynCall_viijijiii = Module["dynCall_viijijiii"] = function() {
                return Module["asm"]["dynCall_viijijiii"].apply(null, arguments)
            }, dynCall_viijji = Module["dynCall_viijji"] = function() {
                return Module["asm"]["dynCall_viijji"].apply(null, arguments)
            }, dynCall_viijjii = Module["dynCall_viijjii"] = function() {
                return Module["asm"]["dynCall_viijjii"].apply(null, arguments)
            }, dynCall_viijjiii = Module["dynCall_viijjiii"] = function() {
                return Module["asm"]["dynCall_viijjiii"].apply(null, arguments)
            }, dynCall_viijjji = Module["dynCall_viijjji"] = function() {
                return Module["asm"]["dynCall_viijjji"].apply(null, arguments)
            }, dynCall_vij = Module["dynCall_vij"] = function() {
                return Module["asm"]["dynCall_vij"].apply(null, arguments)
            }, dynCall_viji = Module["dynCall_viji"] = function() {
                return Module["asm"]["dynCall_viji"].apply(null, arguments)
            }, dynCall_vijii = Module["dynCall_vijii"] = function() {
                return Module["asm"]["dynCall_vijii"].apply(null, arguments)
            }, dynCall_vijiii = Module["dynCall_vijiii"] = function() {
                return Module["asm"]["dynCall_vijiii"].apply(null, arguments)
            }, dynCall_vijiiiiii = Module["dynCall_vijiiiiii"] = function() {
                return Module["asm"]["dynCall_vijiiiiii"].apply(null, arguments)
            }, dynCall_vijiijjiijjji = Module["dynCall_vijiijjiijjji"] = function() {
                return Module["asm"]["dynCall_vijiijjiijjji"].apply(null, arguments)
            }, dynCall_vijiji = Module["dynCall_vijiji"] = function() {
                return Module["asm"]["dynCall_vijiji"].apply(null, arguments)
            }, dynCall_vijijji = Module["dynCall_vijijji"] = function() {
                return Module["asm"]["dynCall_vijijji"].apply(null, arguments)
            }, dynCall_vijji = Module["dynCall_vijji"] = function() {
                return Module["asm"]["dynCall_vijji"].apply(null, arguments)
            }, dynCall_vijjii = Module["dynCall_vijjii"] = function() {
                return Module["asm"]["dynCall_vijjii"].apply(null, arguments)
            }, dynCall_vijjji = Module["dynCall_vijjji"] = function() {
                return Module["asm"]["dynCall_vijjji"].apply(null, arguments)
            }, dynCall_vji = Module["dynCall_vji"] = function() {
                return Module["asm"]["dynCall_vji"].apply(null, arguments)
            }, dynCall_vjii = Module["dynCall_vjii"] = function() {
                return Module["asm"]["dynCall_vjii"].apply(null, arguments)
            }, dynCall_vjiiii = Module["dynCall_vjiiii"] = function() {
                return Module["asm"]["dynCall_vjiiii"].apply(null, arguments)
            }, dynCall_vjji = Module["dynCall_vjji"] = function() {
                return Module["asm"]["dynCall_vjji"].apply(null, arguments)
            }, Module["asm"] = asm, Module["ccall"] = ccall, Module["cwrap"] = cwrap, Module["stackTrace"] = stackTrace, Module["addRunDependency"] = addRunDependency, Module["removeRunDependency"] = removeRunDependency, Module["FS_createPath"] = FS.createPath, Module["FS_createDataFile"] = FS.createDataFile, Module["then"] = function(e) {
                if (Module["calledRun"]) e(Module);
                else {
                    var i = Module["onRuntimeInitialized"];
                    Module["onRuntimeInitialized"] = function() {
                        i && i(), e(Module)
                    }
                }
                return Module
            }, ExitStatus.prototype = new Error, ExitStatus.prototype.constructor = ExitStatus, calledMain = !1, dependenciesFulfilled = function S() {
                Module["calledRun"] || run(), Module["calledRun"] || (dependenciesFulfilled = S)
            }, Module["callMain"] = function L(e) {
                var i, n, t, r, _;
                for (e = e || [], ensureInitRuntime(), i = e.length + 1, n = stackAlloc(4 * (i + 1)), HEAP32[n >> 2] = allocateUTF8OnStack(Module["thisProgram"]), t = 1; i > t; t++) HEAP32[(n >> 2) + t] = allocateUTF8OnStack(e[t - 1]);
                HEAP32[(n >> 2) + i] = 0;
                try {
                    r = Module["_main"](i, n, 0), exit(r, !0)
                } catch (o) {
                    if (o instanceof ExitStatus) return;
                    if ("SimulateInfiniteLoop" == o) return Module["noExitRuntime"] = !0, undefined;
                    _ = o, o && "object" == typeof o && o.stack && (_ = [o, o.stack]), err("exception thrown: " + _), Module["quit"](1, o)
                } finally {
                    calledMain = !0
                }
            }, Module["run"] = run, Module["abort"] = abort, Module["preInit"]) {
            "function" == typeof Module["preInit"] && (Module["preInit"] = [Module["preInit"]]);
            while (Module["preInit"].length > 0) Module["preInit"].pop()()
        }
        return shouldRunNow = !0, Module["noInitialRun"] && (shouldRunNow = !1), Module["noExitRuntime"] = !0, run(), UnityModule
    }
}();
if (typeof exports === 'object' && typeof module === 'object') module.exports = UnityModule;
else if (typeof define === 'function' && define['amd']) define([], function() {
    return UnityModule;
});
else if (typeof exports === 'object') exports["UnityModule"] = UnityModule;