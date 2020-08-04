// https://github.com/peterolson/BigInteger.js

var bigInt = function() {
  function i(e, t) {
    this.value = e,
      this.sign = t
  }

  function s(e) {
    while (e[e.length - 1] === 0 && e.length > 1)
      e.pop();
    return e
  }

  function o(t, n) {
    var r = n < 0;
    if (t.sign !== r)
      return r ? u(t.abs(), -n) : u(t.abs(), n).negate();
    r && (n = -n);
    var o = t.value,
      a = [],
      f = 0;
    for (var l = 0; l < o.length || f > 0; l++) {
      var c = (o[l] || 0) + (l > 0 ? 0 : n) + f;
      f = c >= e ? 1 : 0,
        a.push(c % e)
    }
    return new i(s(a), t.sign)
  }

  function u(t, n) {
    var r = t.value;
    if (r.length === 1)
      return r = r[0],
        t.sign && (r = -r),
        new i([Math.abs(r - n)], r - n < 0);
    if (t.sign !== n < 0)
      return o(t, -n);
    var u = !1;
    t.sign && (u = !0);
    if (r.length === 1 && r[0] < n)
      return new i([n - r[0]], !u);
    u && (n = -n);
    var a = [],
      f = 0;
    for (var l = 0; l < r.length; l++) {
      var c = r[l] - f - (l > 0 ? 0 : n);
      f = c < 0 ? 1 : 0,
        a.push(f * e + c)
    }
    return new i(s(a), u)
  }

  function a(t, n) {
    var r = [],
      i = 0;
    for (var s = 0; s < t.length; s++) {
      i += n * t[s];
      var o = Math.floor(i / e);
      r[s] = i - o * e | 0,
        i = o
    }
    return r[t.length] = i | 0,
      r
  }

  function f(e, t) {
    var n = a(e.value, t < 0 ? -t : t);
    return new i(s(n), t < 0 ? !e.sign : e.sign)
  }

  function l(t, n) {
    var r = [];
    for (var i = 0; i < t.length; i++)
      r[i] = 0;
    var s = 0;
    for (var i = t.length - 1; i >= 0; i--) {
      var o = s * e + t[i],
        u = Math.floor(o / n);
      s = o - u * n,
        r[i] = u | 0
    }
    return {
      quotient: r,
      remainder: s | 0
    }
  }

  function c(e, t) {
    if (t === 0)
      throw new Error("Cannot divide by zero.");
    var n = l(e.value, t < 0 ? -t : t);
    return {
      quotient: new i(s(n.quotient), t < 0 ? !e.sign : e.sign),
      remainder: new i([n.remainder], e.sign)
    }
  }

  function h(t) {
    return (typeof t == "number" || typeof t == "string") && +Math.abs(t) <= e || t instanceof i && t.value.length <= 1
  }

  function p(e, t) {
    return e = N(e).abs(),
      t = N(t).abs(),
      e.equals(t) ? e : e.equals(S) ? t : t.equals(S) ? e : e.isEven() ? t.isOdd() ? p(e.divide(2), t) : p(e.divide(2), t.divide(2)).multiply(2) : t.isEven() ? p(e, t.divide(2)) : e.greater(t) ? p(e.subtract(t).divide(2), t) : p(t.subtract(e).divide(2), e)
  }

  function d(e, t) {
    return e = N(e).abs(),
      t = N(t).abs(),
      e.multiply(t).divide(p(e, t))
  }

  function v(e, t) {
    return e = N(e),
      t = N(t),
      e.greater(t) ? e : t
  }

  function m(e, t) {
    return e = N(e),
      t = N(t),
      e.lesser(t) ? e : t
  }

  function g(t, n) {
    t = N(t),
      n = N(n);
    var r = m(t, n),
      s = v(t, n),
      o = s.subtract(r),
      u = o.value.length - 1,
      a = [],
      f = !0;
    for (var l = u; l >= 0; l--) {
      var c = f ? o.value[l] : e,
        h = Math.floor(Math.random() * c);
      a.unshift(h),
        h < c && (f = !1)
    }
    return r.add(new i(a, !1))
  }

  function E(e, t, n) {
    var r = S,
      i = v(e.abs(), t.abs()),
      s = 0,
      o = x;
    while (o.lesserOrEquals(i)) {
      var u, a;
      u = e.over(o).isEven() ? 0 : 1,
        a = t.over(o).isEven() ? 0 : 1,
        r = r.add(o.times(n(u, a))),
        o = f(o, 2)
    }
    return r
  }

  function N(n) {
    if (n instanceof i)
      return n;
    if (Math.abs(+n) < e && +n === (+n | 0)) {
      var o = +n;
      return new i([Math.abs(o)], o < 0 || 1 / o === -Infinity)
    }
    n += "";
    var u = r.positive,
      o = [];
    n[0] === "-" && (u = r.negative,
      n = n.slice(1));
    var n = n.split(/e/i);
    if (n.length > 2)
      throw new Error("Invalid integer: " + n.join("e"));
    if (n[1]) {
      var a = n[1];
      a[0] === "+" && (a = a.slice(1)),
        a = N(a);
      var f = n[0].indexOf(".");
      f >= 0 && (a = a.minus(n[0].length - f),
        n[0] = n[0].slice(0, f) + n[0].slice(f + 1));
      if (a.lesser(0))
        throw new Error("Cannot include negative exponent part for integers");
      while (a.notEquals(0))
        n[0] += "0",
        a = a.prev()
    }
    n = n[0],
      n === "-0" && (n = "0");
    var l = /^([0-9][0-9]*)$/.test(n);
    if (!l)
      throw new Error("Invalid integer: " + n);
    while (n.length) {
      var c = n.length > t ? n.length - t : 0;
      o.push(+n.slice(c)),
        n = n.slice(0, c)
    }
    return new i(s(o), u)
  }

  function k(e) {
    var t = e.value;
    return t.length === 1 && t[0] <= 36 ? "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t[0]) : "<" + t + ">"
  }

  function L(e, t) {
    t = bigInt(t);
    if (t.equals(0)) {
      if (e.equals(0))
        return "0";
      throw new Error("Cannot convert nonzero numbers to base 0.")
    }
    if (t.equals(-1))
      return e.equals(0) ? "0" : e.lesser(0) ? Array(1 - e).join("10") : "1" + Array(+e).join("01");
    var n = "";
    e.isNegative() && t.isPositive() && (n = "-",
      e = e.abs());
    if (t.equals(1))
      return e.equals(0) ? "0" : n + Array(+e + 1).join(1);
    var r = [],
      i = e,
      s;
    while (i.lesser(0) || i.compareAbs(t) >= 0) {
      s = i.divmod(t),
        i = s.quotient;
      var o = s.remainder;
      o.lesser(0) && (o = t.minus(o).abs(),
          i = i.next()),
        r.push(k(o))
    }
    return r.push(k(i)),
      n + r.reverse().join("")
  }
  var e = 1e7,
    t = 7,
    n = "0000000",
    r = {
      positive: !1,
      negative: !0
    };
  i.prototype.negate = function() {
      return new i(this.value, !this.sign)
    },
    i.prototype.abs = function() {
      return new i(this.value, r.positive)
    },
    i.prototype.add = function(t) {
      if (h(t))
        return o(this, +t);
      t = N(t);
      if (this.sign !== t.sign)
        return this.sign === r.positive ? this.abs().subtract(t.abs()) : t.abs().subtract(this.abs());
      var n = this.value,
        u = t.value,
        a = [],
        f = 0,
        l = Math.max(n.length, u.length);
      for (var c = 0; c < l || f > 0; c++) {
        var p = (n[c] || 0) + (u[c] || 0) + f;
        f = p >= e ? 1 : 0,
          a.push(p % e)
      }
      return new i(s(a), this.sign)
    },
    i.prototype.plus = i.prototype.add,
    i.prototype.subtract = function(t) {
      if (h(t))
        return u(this, +t);
      t = N(t);
      if (this.sign !== t.sign)
        return this.add(t.negate());
      if (this.sign === r.negative)
        return t.negate().subtract(this.negate());
      if (this.compare(t) < 0)
        return t.subtract(this).negate();
      var n = this.value,
        o = t.value,
        a = [],
        f = 0,
        l = Math.max(n.length, o.length);
      for (var c = 0; c < l; c++) {
        var p = n[c] || 0,
          d = o[c] || 0,
          v = p - f;
        f = v < d ? 1 : 0,
          a.push(f * e + v - d)
      }
      return new i(s(a), r.positive)
    },
    i.prototype.minus = i.prototype.subtract,
    i.prototype.multiply = function(t) {
      if (h(t))
        return f(this, +t);
      t = N(t);
      var n = this.sign !== t.sign,
        r = this.value,
        o = t.value,
        u = [];
      for (var a = r.length + o.length; a > 0; a--)
        u.push(0);
      for (var a = 0; a < r.length; a++) {
        var l = r[a];
        for (var c = 0; c < o.length; c++) {
          var p = o[c],
            d = l * p + u[a + c],
            v = Math.floor(d / e);
          u[a + c] = d - v * e,
            u[a + c + 1] += v
        }
      }
      return new i(s(u), n)
    },
    i.prototype.times = i.prototype.multiply,
    i.prototype.divmod = function(t) {
      if (h(t))
        return c(this, +t);
      t = N(t);
      var n = this.sign !== t.sign;
      if (t.equals(S))
        throw new Error("Cannot divide by zero");
      if (this.equals(S))
        return {
          quotient: new i([0], r.positive),
          remainder: new i([0], r.positive)
        };
      var o = this.value,
        u = t.value,
        f = [0];
      for (var p = 0; p < u.length; p++)
        f[p] = 0;
      var d = u[u.length - 1],
        v = Math.ceil(e / 2 / d),
        m = a(o, v),
        g = a(u, v);
      d = g[u.length - 1];
      for (var y = o.length - u.length; y >= 0; y--) {
        var b = e - 1;
        m[y + u.length] !== d && (b = Math.floor((m[y + u.length] * e + m[y + u.length - 1]) / d));
        var w = 0,
          E = 0;
        for (var p = 0; p < g.length; p++) {
          w += b * g[p];
          var x = Math.floor(w / e);
          E += m[y + p] - (w - x * e),
            w = x,
            E < 0 ? (m[y + p] = E + e | 0,
              E = -1) : (m[y + p] = E | 0,
              E = 0)
        }
        while (E !== 0) {
          b -= 1;
          var w = 0;
          for (var p = 0; p < g.length; p++)
            w += m[y + p] - e + g[p],
            w < 0 ? (m[y + p] = w + e | 0,
              w = 0) : (m[y + p] = w | 0,
              w = 1);
          E += w
        }
        f[y] = b | 0
      }
      return m = l(m, v).quotient, {
        quotient: new i(s(f), n),
        remainder: new i(s(m), this.sign)
      }
    },
    i.prototype.divide = function(e) {
      return this.divmod(e).quotient
    },
    i.prototype.over = i.prototype.divide,
    i.prototype.mod = function(e) {
      return this.divmod(e).remainder
    },
    i.prototype.remainder = i.prototype.mod,
    i.prototype.pow = function(e) {
      e = N(e);
      var t = this,
        n = e,
        r = x;
      if (n.equals(S))
        return r;
      if (t.equals(S) || n.lesser(S))
        return S;
      for (;;) {
        n.isOdd() && (r = r.times(t)),
          n = n.divide(2);
        if (n.equals(S))
          break;
        t = t.times(t)
      }
      return r
    },
    i.prototype.modPow = function(e, t) {
      e = N(e),
        t = N(t);
      if (t.equals(S))
        throw new Error("Cannot take modPow with modulus 0");
      var n = x,
        r = this.mod(t);
      if (r.equals(S))
        return S;
      while (e.greater(0))
        e.isOdd() && (n = n.multiply(r).mod(t)),
        e = e.divide(2),
        r = r.square().mod(t);
      return n
    },
    i.prototype.square = function() {
      return this.multiply(this)
    },
    i.prototype.next = function() {
      return o(this, 1)
    },
    i.prototype.prev = function() {
      return u(this, 1)
    },
    i.prototype.compare = function(e) {
      var t = this,
        n = N(e);
      if (t.value.length === 1 && n.value.length === 1 && t.value[0] === 0 && n.value[0] === 0)
        return 0;
      if (n.sign !== t.sign)
        return t.sign === r.positive ? 1 : -1;
      var i = t.sign === r.positive ? 1 : -1,
        s = t.value,
        o = n.value,
        u = Math.max(s.length, o.length) - 1;
      for (var a = u; a >= 0; a--) {
        var f = s[a] || 0,
          l = o[a] || 0;
        if (f > l)
          return 1 * i;
        if (l > f)
          return -1 * i
      }
      return 0
    },
    i.prototype.compareAbs = function(e) {
      return this.abs().compare(e.abs())
    },
    i.prototype.equals = function(e) {
      return this.compare(e) === 0
    },
    i.prototype.notEquals = function(e) {
      return !this.equals(e)
    },
    i.prototype.lesser = function(e) {
      return this.compare(e) < 0
    },
    i.prototype.greater = function(e) {
      return this.compare(e) > 0
    },
    i.prototype.greaterOrEquals = function(e) {
      return this.compare(e) >= 0
    },
    i.prototype.lesserOrEquals = function(e) {
      return this.compare(e) <= 0
    },
    i.prototype.compareTo = i.prototype.compare,
    i.prototype.lt = i.prototype.lesser,
    i.prototype.leq = i.prototype.lesserOrEquals,
    i.prototype.gt = i.prototype.greater,
    i.prototype.geq = i.prototype.greaterOrEquals,
    i.prototype.eq = i.prototype.equals,
    i.prototype.neq = i.prototype.notEquals,
    i.prototype.isPositive = function() {
      return this.value.length === 1 && this.value[0] === 0 ? !1 : this.sign === r.positive
    },
    i.prototype.isNegative = function() {
      return this.value.length === 1 && this.value[0] === 0 ? !1 : this.sign === r.negative
    },
    i.prototype.isEven = function() {
      return this.value[0] % 2 === 0
    },
    i.prototype.isOdd = function() {
      return this.value[0] % 2 === 1
    },
    i.prototype.isUnit = function() {
      return this.value.length === 1 && this.value[0] === 1
    },
    i.prototype.isZero = function() {
      return this.value.length === 1 && this.value[0] === 0
    },
    i.prototype.isDivisibleBy = function(e) {
      return e = N(e),
        e.isZero() ? !1 : this.mod(e).equals(S)
    },
    i.prototype.isPrime = function() {
      var e = this.abs(),
        t = e.prev();
      if (e.isUnit())
        return !1;
      if (e.equals(2) || e.equals(3) || e.equals(5))
        return !0;
      if (e.isEven() || e.isDivisibleBy(3) || e.isDivisibleBy(5))
        return !1;
      if (e.lesser(25))
        return !0;
      var n = [2, 3, 5, 7, 11, 13, 17, 19],
        r = t,
        i, s, o, u;
      while (r.isEven())
        r = r.divide(2);
      for (o = 0; o < n.length; o++) {
        u = bigInt(n[o]).modPow(r, e);
        if (u.equals(x) || u.equals(t))
          continue;
        for (s = !0,
          i = r; s && i.lesser(t); i = i.multiply(2))
          u = u.square().mod(e),
          u.equals(t) && (s = !1);
        if (s)
          return !1
      }
      return !0
    };
  var y = [1];
  while (y[y.length - 1] <= e)
    y.push(2 * y[y.length - 1]);
  var b = y.length,
    w = y[b - 1];
  i.prototype.shiftLeft = function(e) {
      if (!h(e))
        return e.isNegative() ? this.shiftRight(e.abs()) : this.times(bigInt(2).pow(e));
      e = +e;
      if (e < 0)
        return this.shiftRight(-e);
      var t = this;
      while (e >= b)
        t = f(t, w),
        e -= b - 1;
      return f(t, y[e])
    },
    i.prototype.shiftRight = function(e) {
      if (!h(e))
        return e.isNegative() ? this.shiftLeft(e.abs()) : this.over(bigInt(2).pow(e));
      e = +e;
      if (e < 0)
        return this.shiftLeft(-e);
      var t = this;
      while (e >= b) {
        if (t.equals(S))
          return t;
        t = c(t, w).quotient,
          e -= b - 1
      }
      return c(t, y[e]).quotient
    },
    i.prototype.not = function() {
      var e = E(this, this, function(e) {
        return (e + 1) % 2
      });
      return this.sign ? e : e.negate()
    },
    i.prototype.and = function(e) {
      e = N(e);
      var t = E(this, e, function(e, t) {
        return e * t
      });
      return this.sign && e.sign ? t.negate() : t
    },
    i.prototype.or = function(e) {
      e = N(e);
      var t = E(this, e, function(e, t) {
        return (e + t + e * t) % 2
      });
      return this.sign || e.sign ? t.negate() : t
    },
    i.prototype.xor = function(e) {
      e = N(e);
      var t = E(this, e, function(e, t) {
        return (e + t) % 2
      });
      return this.sign ^ e.sign ? t.negate() : t
    },
    i.prototype.toString = function(e) {
      e === undefined && (e = 10);
      if (e !== 10)
        return L(this, e);
      var t = this,
        i = "",
        s = t.value.length;
      if (s === 0 || s === 1 && t.value[0] === 0)
        return "0";
      s -= 1,
        i = t.value[s].toString();
      while (--s >= 0) {
        var o = t.value[s].toString();
        i += n.slice(o.length) + o
      }
      var u = t.sign === r.positive ? "" : "-";
      return u + i
    },
    i.prototype.toJSNumber = function() {
      return this.valueOf()
    },
    i.prototype.valueOf = function() {
      return this.value.length === 1 ? this.sign ? -this.value[0] : this.value[0] : +this.toString()
    };
  var S = new i([0], r.positive),
    x = new i([1], r.positive),
    T = new i([1], r.negative),
    C = function(e, t) {
      function o(e) {
        var t = e[i].toLowerCase();
        if (i === 0 && e[i] === "-") {
          s = !0;
          return
        }
        if (/[0-9]/.test(t))
          r.push(N(t));
        else if (/[a-z]/.test(t))
          r.push(N(t.charCodeAt(0) - 87));
        else {
          if (t !== "<")
            throw new Error(t + " is not a valid character");
          var n = i;
          do
            i++;
          while (e[i] !== ">");
          r.push(N(e.slice(n + 1, i)))
        }
      }
      t = N(t);
      var n = S,
        r = [],
        i, s = !1;
      for (i = 0; i < e.length; i++)
        o(e);
      r.reverse();
      for (i = 0; i < r.length; i++)
        n = n.add(r[i].times(t.pow(i)));
      return s ? n.negate() : n
    },
    A = function(e, t) {
      return typeof e == "undefined" ? S : typeof t != "undefined" ? C(e, t) : N(e)
    };
  return A.zero = S,
    A.one = x,
    A.minusOne = T,
    A.randBetween = g,
    A.min = m,
    A.max = v,
    A.gcd = p,
    A.lcm = d,
    A
}();
typeof module != "undefined" && (module.exports = bigInt);