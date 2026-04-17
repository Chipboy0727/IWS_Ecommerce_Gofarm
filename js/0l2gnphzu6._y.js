(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  527069,
  (e) => {
    "use strict";
    e.s([
      "clamp",
      0,
      function (e, [t, r]) {
        return Math.min(r, Math.max(t, e));
      },
    ]);
  },
  820268,
  (e) => {
    "use strict";
    let t = (0, e.i(801685).default)("chevron-down", [
      ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }],
    ]);
    e.s(["ChevronDown", 0, t], 820268);
  },
  890055,
  (e) => {
    "use strict";
    let t = (0, e.i(801685).default)("chevron-up", [
      ["path", { d: "m18 15-6-6-6 6", key: "153udz" }],
    ]);
    e.s(["ChevronUp", 0, t], 890055);
  },
  25486,
  (e) => {
    "use strict";
    var t = e.i(546121);
    e.i(198615);
    var r = t.createContext(void 0);
    e.s([
      "useDirection",
      0,
      function (e) {
        let n = t.useContext(r);
        return e || n || "ltr";
      },
    ]);
  },
  41986,
  (e) => {
    "use strict";
    var t = e.i(546121),
      r = e.i(543250),
      n = e.i(967928),
      l = e.i(652053),
      o = e.i(198615),
      i = new WeakMap();
    function s(e, t) {
      var r, n;
      let l, o, i;
      if ("at" in Array.prototype) return Array.prototype.at.call(e, t);
      let s =
        ((r = e),
        (n = t),
        (l = r.length),
        (i = (o = a(n)) >= 0 ? o : l + o) < 0 || i >= l ? -1 : i);
      return -1 === s ? void 0 : e[s];
    }
    function a(e) {
      return e != e || 0 === e ? 0 : Math.trunc(e);
    }
    ((class e extends Map {
      #e;
      constructor(e) {
        (super(e), (this.#e = [...super.keys()]), i.set(this, !0));
      }
      set(e, t) {
        return (
          i.get(this) &&
            (this.has(e) ? (this.#e[this.#e.indexOf(e)] = e) : this.#e.push(e)),
          super.set(e, t),
          this
        );
      }
      insert(e, t, r) {
        let n,
          l = this.has(t),
          o = this.#e.length,
          i = a(e),
          s = i >= 0 ? i : o + i,
          d = s < 0 || s >= o ? -1 : s;
        if (d === this.size || (l && d === this.size - 1) || -1 === d)
          return (this.set(t, r), this);
        let u = this.size + +!l;
        i < 0 && s++;
        let c = [...this.#e],
          p = !1;
        for (let e = s; e < u; e++)
          if (s === e) {
            let o = c[e];
            (c[e] === t && (o = c[e + 1]),
              l && this.delete(t),
              (n = this.get(o)),
              this.set(t, r));
          } else {
            p || c[e - 1] !== t || (p = !0);
            let r = c[p ? e : e - 1],
              l = n;
            ((n = this.get(r)), this.delete(r), this.set(r, l));
          }
        return this;
      }
      with(t, r, n) {
        let l = new e(this);
        return (l.insert(t, r, n), l);
      }
      before(e) {
        let t = this.#e.indexOf(e) - 1;
        if (!(t < 0)) return this.entryAt(t);
      }
      setBefore(e, t, r) {
        let n = this.#e.indexOf(e);
        return -1 === n ? this : this.insert(n, t, r);
      }
      after(e) {
        let t = this.#e.indexOf(e);
        if (-1 !== (t = -1 === t || t === this.size - 1 ? -1 : t + 1))
          return this.entryAt(t);
      }
      setAfter(e, t, r) {
        let n = this.#e.indexOf(e);
        return -1 === n ? this : this.insert(n + 1, t, r);
      }
      first() {
        return this.entryAt(0);
      }
      last() {
        return this.entryAt(-1);
      }
      clear() {
        return ((this.#e = []), super.clear());
      }
      delete(e) {
        let t = super.delete(e);
        return (t && this.#e.splice(this.#e.indexOf(e), 1), t);
      }
      deleteAt(e) {
        let t = this.keyAt(e);
        return void 0 !== t && this.delete(t);
      }
      at(e) {
        let t = s(this.#e, e);
        if (void 0 !== t) return this.get(t);
      }
      entryAt(e) {
        let t = s(this.#e, e);
        if (void 0 !== t) return [t, this.get(t)];
      }
      indexOf(e) {
        return this.#e.indexOf(e);
      }
      keyAt(e) {
        return s(this.#e, e);
      }
      from(e, t) {
        let r = this.indexOf(e);
        if (-1 === r) return;
        let n = r + t;
        return (
          n < 0 && (n = 0),
          n >= this.size && (n = this.size - 1),
          this.at(n)
        );
      }
      keyFrom(e, t) {
        let r = this.indexOf(e);
        if (-1 === r) return;
        let n = r + t;
        return (
          n < 0 && (n = 0),
          n >= this.size && (n = this.size - 1),
          this.keyAt(n)
        );
      }
      find(e, t) {
        let r = 0;
        for (let n of this) {
          if (Reflect.apply(e, t, [n, r, this])) return n;
          r++;
        }
      }
      findIndex(e, t) {
        let r = 0;
        for (let n of this) {
          if (Reflect.apply(e, t, [n, r, this])) return r;
          r++;
        }
        return -1;
      }
      filter(t, r) {
        let n = [],
          l = 0;
        for (let e of this)
          (Reflect.apply(t, r, [e, l, this]) && n.push(e), l++);
        return new e(n);
      }
      map(t, r) {
        let n = [],
          l = 0;
        for (let e of this)
          (n.push([e[0], Reflect.apply(t, r, [e, l, this])]), l++);
        return new e(n);
      }
      reduce(...e) {
        let [t, r] = e,
          n = 0,
          l = r ?? this.at(0);
        for (let r of this)
          ((l =
            0 === n && 1 === e.length
              ? r
              : Reflect.apply(t, this, [l, r, n, this])),
            n++);
        return l;
      }
      reduceRight(...e) {
        let [t, r] = e,
          n = r ?? this.at(-1);
        for (let r = this.size - 1; r >= 0; r--) {
          let l = this.at(r);
          n =
            r === this.size - 1 && 1 === e.length
              ? l
              : Reflect.apply(t, this, [n, l, r, this]);
        }
        return n;
      }
      toSorted(t) {
        return new e([...this.entries()].sort(t));
      }
      toReversed() {
        let t = new e();
        for (let e = this.size - 1; e >= 0; e--) {
          let r = this.keyAt(e),
            n = this.get(r);
          t.set(r, n);
        }
        return t;
      }
      toSpliced(...t) {
        let r = [...this.entries()];
        return (r.splice(...t), new e(r));
      }
      slice(t, r) {
        let n = new e(),
          l = this.size - 1;
        if (void 0 === t) return n;
        (t < 0 && (t += this.size), void 0 !== r && r > 0 && (l = r - 1));
        for (let e = t; e <= l; e++) {
          let t = this.keyAt(e),
            r = this.get(t);
          n.set(t, r);
        }
        return n;
      }
      every(e, t) {
        let r = 0;
        for (let n of this) {
          if (!Reflect.apply(e, t, [n, r, this])) return !1;
          r++;
        }
        return !0;
      }
      some(e, t) {
        let r = 0;
        for (let n of this) {
          if (Reflect.apply(e, t, [n, r, this])) return !0;
          r++;
        }
        return !1;
      }
    }),
      e.s([
        "createCollection",
        0,
        function (e) {
          let i = e + "CollectionProvider",
            [s, a] = (0, r.createContextScope)(i),
            [d, u] = s(i, {
              collectionRef: { current: null },
              itemMap: new Map(),
            }),
            c = (e) => {
              let { scope: r, children: n } = e,
                l = t.default.useRef(null),
                i = t.default.useRef(new Map()).current;
              return (0, o.jsx)(d, {
                scope: r,
                itemMap: i,
                collectionRef: l,
                children: n,
              });
            };
          c.displayName = i;
          let p = e + "CollectionSlot",
            f = (0, l.createSlot)(p),
            h = t.default.forwardRef((e, t) => {
              let { scope: r, children: l } = e,
                i = u(p, r),
                s = (0, n.useComposedRefs)(t, i.collectionRef);
              return (0, o.jsx)(f, { ref: s, children: l });
            });
          h.displayName = p;
          let m = e + "CollectionItemSlot",
            v = "data-radix-collection-item",
            y = (0, l.createSlot)(m),
            x = t.default.forwardRef((e, r) => {
              let { scope: l, children: i, ...s } = e,
                a = t.default.useRef(null),
                d = (0, n.useComposedRefs)(r, a),
                c = u(m, l);
              return (
                t.default.useEffect(
                  () => (
                    c.itemMap.set(a, { ref: a, ...s }),
                    () => void c.itemMap.delete(a)
                  ),
                ),
                (0, o.jsx)(y, { ...{ [v]: "" }, ref: d, children: i })
              );
            });
          return (
            (x.displayName = m),
            [
              { Provider: c, Slot: h, ItemSlot: x },
              function (r) {
                let n = u(e + "CollectionConsumer", r);
                return t.default.useCallback(() => {
                  let e = n.collectionRef.current;
                  if (!e) return [];
                  let t = Array.from(e.querySelectorAll(`[${v}]`));
                  return Array.from(n.itemMap.values()).sort(
                    (e, r) =>
                      t.indexOf(e.ref.current) - t.indexOf(r.ref.current),
                  );
                }, [n.collectionRef, n.itemMap]);
              },
              a,
            ]
          );
        },
      ]));
  },
  506703,
  (e) => {
    "use strict";
    let t = (0, e.i(801685).default)("check", [
      ["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }],
    ]);
    e.s(["Check", 0, t], 506703);
  },
  184017,
  (e) => {
    "use strict";
    var t = e.i(546121);
    e.s([
      "usePrevious",
      0,
      function (e) {
        let r = t.useRef({ value: e, previous: e });
        return t.useMemo(
          () => (
            r.current.value !== e &&
              ((r.current.previous = r.current.value), (r.current.value = e)),
            r.current.previous
          ),
          [e],
        );
      },
    ]);
  },
  62870,
  (e) => {
    "use strict";
    var t = e.i(198615),
      r = e.i(546121),
      n = e.i(171763),
      l = e.i(527069),
      o = e.i(291967),
      i = e.i(41986),
      s = e.i(967928),
      a = e.i(543250),
      d = e.i(25486),
      u = e.i(348989),
      c = e.i(539340),
      p = e.i(445424),
      f = e.i(194012),
      h = e.i(638154),
      m = e.i(332374),
      v = e.i(980939),
      y = e.i(652053),
      x = e.i(136131),
      w = e.i(417256),
      g = e.i(672687),
      S = e.i(184017),
      C = e.i(747791),
      b = e.i(73772),
      R = e.i(206500),
      j = [" ", "Enter", "ArrowUp", "ArrowDown"],
      k = [" ", "Enter"],
      E = "Select",
      [N, P, T] = (0, i.createCollection)(E),
      [I, A] = (0, a.createContextScope)(E, [T, h.createPopperScope]),
      M = (0, h.createPopperScope)(),
      [D, H] = I(E),
      [L, O] = I(E),
      z = (e) => {
        let {
            __scopeSelect: n,
            children: l,
            open: o,
            defaultOpen: i,
            onOpenChange: s,
            value: a,
            defaultValue: u,
            onValueChange: c,
            dir: p,
            name: m,
            autoComplete: v,
            disabled: y,
            required: x,
            form: g,
          } = e,
          S = M(n),
          [C, b] = r.useState(null),
          [R, j] = r.useState(null),
          [k, P] = r.useState(!1),
          T = (0, d.useDirection)(p),
          [I, A] = (0, w.useControllableState)({
            prop: o,
            defaultProp: i ?? !1,
            onChange: s,
            caller: E,
          }),
          [H, O] = (0, w.useControllableState)({
            prop: a,
            defaultProp: u,
            onChange: c,
            caller: E,
          }),
          z = r.useRef(null),
          _ = !C || g || !!C.closest("form"),
          [B, V] = r.useState(new Set()),
          F = Array.from(B)
            .map((e) => e.props.value)
            .join(";");
        return (0, t.jsx)(h.Root, {
          ...S,
          children: (0, t.jsxs)(D, {
            required: x,
            scope: n,
            trigger: C,
            onTriggerChange: b,
            valueNode: R,
            onValueNodeChange: j,
            valueNodeHasChildren: k,
            onValueNodeHasChildrenChange: P,
            contentId: (0, f.useId)(),
            value: H,
            onValueChange: O,
            open: I,
            onOpenChange: A,
            dir: T,
            triggerPointerDownPosRef: z,
            disabled: y,
            children: [
              (0, t.jsx)(N.Provider, {
                scope: n,
                children: (0, t.jsx)(L, {
                  scope: e.__scopeSelect,
                  onNativeOptionAdd: r.useCallback((e) => {
                    V((t) => new Set(t).add(e));
                  }, []),
                  onNativeOptionRemove: r.useCallback((e) => {
                    V((t) => {
                      let r = new Set(t);
                      return (r.delete(e), r);
                    });
                  }, []),
                  children: l,
                }),
              }),
              _
                ? (0, t.jsxs)(
                    eb,
                    {
                      "aria-hidden": !0,
                      required: x,
                      tabIndex: -1,
                      name: m,
                      autoComplete: v,
                      value: H,
                      onChange: (e) => O(e.target.value),
                      disabled: y,
                      form: g,
                      children: [
                        void 0 === H
                          ? (0, t.jsx)("option", { value: "" })
                          : null,
                        Array.from(B),
                      ],
                    },
                    F,
                  )
                : null,
            ],
          }),
        });
      };
    z.displayName = E;
    var _ = "SelectTrigger",
      B = r.forwardRef((e, n) => {
        let { __scopeSelect: l, disabled: i = !1, ...a } = e,
          d = M(l),
          u = H(_, l),
          c = u.disabled || i,
          p = (0, s.useComposedRefs)(n, u.onTriggerChange),
          f = P(l),
          m = r.useRef("touch"),
          [y, x, w] = ej((e) => {
            let t = f().filter((e) => !e.disabled),
              r = t.find((e) => e.value === u.value),
              n = ek(t, e, r);
            void 0 !== n && u.onValueChange(n.value);
          }),
          g = (e) => {
            (c || (u.onOpenChange(!0), w()),
              e &&
                (u.triggerPointerDownPosRef.current = {
                  x: Math.round(e.pageX),
                  y: Math.round(e.pageY),
                }));
          };
        return (0, t.jsx)(h.Anchor, {
          asChild: !0,
          ...d,
          children: (0, t.jsx)(v.Primitive.button, {
            type: "button",
            role: "combobox",
            "aria-controls": u.contentId,
            "aria-expanded": u.open,
            "aria-required": u.required,
            "aria-autocomplete": "none",
            dir: u.dir,
            "data-state": u.open ? "open" : "closed",
            disabled: c,
            "data-disabled": c ? "" : void 0,
            "data-placeholder": eR(u.value) ? "" : void 0,
            ...a,
            ref: p,
            onClick: (0, o.composeEventHandlers)(a.onClick, (e) => {
              (e.currentTarget.focus(), "mouse" !== m.current && g(e));
            }),
            onPointerDown: (0, o.composeEventHandlers)(a.onPointerDown, (e) => {
              m.current = e.pointerType;
              let t = e.target;
              (t.hasPointerCapture(e.pointerId) &&
                t.releasePointerCapture(e.pointerId),
                0 === e.button &&
                  !1 === e.ctrlKey &&
                  "mouse" === e.pointerType &&
                  (g(e), e.preventDefault()));
            }),
            onKeyDown: (0, o.composeEventHandlers)(a.onKeyDown, (e) => {
              let t = "" !== y.current;
              (e.ctrlKey ||
                e.altKey ||
                e.metaKey ||
                1 !== e.key.length ||
                x(e.key),
                (!t || " " !== e.key) &&
                  j.includes(e.key) &&
                  (g(), e.preventDefault()));
            }),
          }),
        });
      });
    B.displayName = _;
    var V = "SelectValue",
      F = r.forwardRef((e, r) => {
        let {
            __scopeSelect: n,
            className: l,
            style: o,
            children: i,
            placeholder: a = "",
            ...d
          } = e,
          u = H(V, n),
          { onValueNodeHasChildrenChange: c } = u,
          p = void 0 !== i,
          f = (0, s.useComposedRefs)(r, u.onValueNodeChange);
        return (
          (0, g.useLayoutEffect)(() => {
            c(p);
          }, [c, p]),
          (0, t.jsx)(v.Primitive.span, {
            ...d,
            ref: f,
            style: { pointerEvents: "none" },
            children: eR(u.value) ? (0, t.jsx)(t.Fragment, { children: a }) : i,
          })
        );
      });
    F.displayName = V;
    var K = r.forwardRef((e, r) => {
      let { __scopeSelect: n, children: l, ...o } = e;
      return (0, t.jsx)(v.Primitive.span, {
        "aria-hidden": !0,
        ...o,
        ref: r,
        children: l || "▼",
      });
    });
    K.displayName = "SelectIcon";
    var U = (e) => (0, t.jsx)(m.Portal, { asChild: !0, ...e });
    U.displayName = "SelectPortal";
    var W = "SelectContent",
      q = r.forwardRef((e, l) => {
        let o = H(W, e.__scopeSelect),
          [i, s] = r.useState();
        return ((0, g.useLayoutEffect)(() => {
          s(new DocumentFragment());
        }, []),
        o.open)
          ? (0, t.jsx)(Z, { ...e, ref: l })
          : i
            ? n.createPortal(
                (0, t.jsx)(Y, {
                  scope: e.__scopeSelect,
                  children: (0, t.jsx)(N.Slot, {
                    scope: e.__scopeSelect,
                    children: (0, t.jsx)("div", { children: e.children }),
                  }),
                }),
                i,
              )
            : null;
      });
    q.displayName = W;
    var [Y, G] = I(W),
      X = (0, y.createSlot)("SelectContent.RemoveScroll"),
      Z = r.forwardRef((e, n) => {
        let {
            __scopeSelect: l,
            position: i = "item-aligned",
            onCloseAutoFocus: a,
            onEscapeKeyDown: d,
            onPointerDownOutside: f,
            side: h,
            sideOffset: m,
            align: v,
            alignOffset: y,
            arrowPadding: x,
            collisionBoundary: w,
            collisionPadding: g,
            sticky: S,
            hideWhenDetached: C,
            avoidCollisions: j,
            ...k
          } = e,
          E = H(W, l),
          [N, T] = r.useState(null),
          [I, A] = r.useState(null),
          M = (0, s.useComposedRefs)(n, (e) => T(e)),
          [D, L] = r.useState(null),
          [O, z] = r.useState(null),
          _ = P(l),
          [B, V] = r.useState(!1),
          F = r.useRef(!1);
        (r.useEffect(() => {
          if (N) return (0, b.hideOthers)(N);
        }, [N]),
          (0, c.useFocusGuards)());
        let K = r.useCallback(
            (e) => {
              let [t, ...r] = _().map((e) => e.ref.current),
                [n] = r.slice(-1),
                l = document.activeElement;
              for (let r of e)
                if (
                  r === l ||
                  (r?.scrollIntoView({ block: "nearest" }),
                  r === t && I && (I.scrollTop = 0),
                  r === n && I && (I.scrollTop = I.scrollHeight),
                  r?.focus(),
                  document.activeElement !== l)
                )
                  return;
            },
            [_, I],
          ),
          U = r.useCallback(() => K([D, N]), [K, D, N]);
        r.useEffect(() => {
          B && U();
        }, [B, U]);
        let { onOpenChange: q, triggerPointerDownPosRef: G } = E;
        (r.useEffect(() => {
          if (N) {
            let e = { x: 0, y: 0 },
              t = (t) => {
                e = {
                  x: Math.abs(Math.round(t.pageX) - (G.current?.x ?? 0)),
                  y: Math.abs(Math.round(t.pageY) - (G.current?.y ?? 0)),
                };
              },
              r = (r) => {
                (e.x <= 10 && e.y <= 10
                  ? r.preventDefault()
                  : N.contains(r.target) || q(!1),
                  document.removeEventListener("pointermove", t),
                  (G.current = null));
              };
            return (
              null !== G.current &&
                (document.addEventListener("pointermove", t),
                document.addEventListener("pointerup", r, {
                  capture: !0,
                  once: !0,
                })),
              () => {
                (document.removeEventListener("pointermove", t),
                  document.removeEventListener("pointerup", r, {
                    capture: !0,
                  }));
              }
            );
          }
        }, [N, q, G]),
          r.useEffect(() => {
            let e = () => q(!1);
            return (
              window.addEventListener("blur", e),
              window.addEventListener("resize", e),
              () => {
                (window.removeEventListener("blur", e),
                  window.removeEventListener("resize", e));
              }
            );
          }, [q]));
        let [Z, Q] = ej((e) => {
            let t = _().filter((e) => !e.disabled),
              r = t.find((e) => e.ref.current === document.activeElement),
              n = ek(t, e, r);
            n && setTimeout(() => n.ref.current.focus());
          }),
          ee = r.useCallback(
            (e, t, r) => {
              let n = !F.current && !r;
              ((void 0 !== E.value && E.value === t) || n) &&
                (L(e), n && (F.current = !0));
            },
            [E.value],
          ),
          et = r.useCallback(() => N?.focus(), [N]),
          er = r.useCallback(
            (e, t, r) => {
              let n = !F.current && !r;
              ((void 0 !== E.value && E.value === t) || n) && z(e);
            },
            [E.value],
          ),
          en = "popper" === i ? J : $,
          el =
            en === J
              ? {
                  side: h,
                  sideOffset: m,
                  align: v,
                  alignOffset: y,
                  arrowPadding: x,
                  collisionBoundary: w,
                  collisionPadding: g,
                  sticky: S,
                  hideWhenDetached: C,
                  avoidCollisions: j,
                }
              : {};
        return (0, t.jsx)(Y, {
          scope: l,
          content: N,
          viewport: I,
          onViewportChange: A,
          itemRefCallback: ee,
          selectedItem: D,
          onItemLeave: et,
          itemTextRefCallback: er,
          focusSelectedItem: U,
          selectedItemText: O,
          position: i,
          isPositioned: B,
          searchRef: Z,
          children: (0, t.jsx)(R.RemoveScroll, {
            as: X,
            allowPinchZoom: !0,
            children: (0, t.jsx)(p.FocusScope, {
              asChild: !0,
              trapped: E.open,
              onMountAutoFocus: (e) => {
                e.preventDefault();
              },
              onUnmountAutoFocus: (0, o.composeEventHandlers)(a, (e) => {
                (E.trigger?.focus({ preventScroll: !0 }), e.preventDefault());
              }),
              children: (0, t.jsx)(u.DismissableLayer, {
                asChild: !0,
                disableOutsidePointerEvents: !0,
                onEscapeKeyDown: d,
                onPointerDownOutside: f,
                onFocusOutside: (e) => e.preventDefault(),
                onDismiss: () => E.onOpenChange(!1),
                children: (0, t.jsx)(en, {
                  role: "listbox",
                  id: E.contentId,
                  "data-state": E.open ? "open" : "closed",
                  dir: E.dir,
                  onContextMenu: (e) => e.preventDefault(),
                  ...k,
                  ...el,
                  onPlaced: () => V(!0),
                  ref: M,
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    outline: "none",
                    ...k.style,
                  },
                  onKeyDown: (0, o.composeEventHandlers)(k.onKeyDown, (e) => {
                    let t = e.ctrlKey || e.altKey || e.metaKey;
                    if (
                      ("Tab" === e.key && e.preventDefault(),
                      t || 1 !== e.key.length || Q(e.key),
                      ["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key))
                    ) {
                      let t = _()
                        .filter((e) => !e.disabled)
                        .map((e) => e.ref.current);
                      if (
                        (["ArrowUp", "End"].includes(e.key) &&
                          (t = t.slice().reverse()),
                        ["ArrowUp", "ArrowDown"].includes(e.key))
                      ) {
                        let r = e.target,
                          n = t.indexOf(r);
                        t = t.slice(n + 1);
                      }
                      (setTimeout(() => K(t)), e.preventDefault());
                    }
                  }),
                }),
              }),
            }),
          }),
        });
      });
    Z.displayName = "SelectContentImpl";
    var $ = r.forwardRef((e, n) => {
      let { __scopeSelect: o, onPlaced: i, ...a } = e,
        d = H(W, o),
        u = G(W, o),
        [c, p] = r.useState(null),
        [f, h] = r.useState(null),
        m = (0, s.useComposedRefs)(n, (e) => h(e)),
        y = P(o),
        x = r.useRef(!1),
        w = r.useRef(!0),
        {
          viewport: S,
          selectedItem: C,
          selectedItemText: b,
          focusSelectedItem: R,
        } = u,
        j = r.useCallback(() => {
          if (d.trigger && d.valueNode && c && f && S && C && b) {
            let e = d.trigger.getBoundingClientRect(),
              t = f.getBoundingClientRect(),
              r = d.valueNode.getBoundingClientRect(),
              n = b.getBoundingClientRect();
            if ("rtl" !== d.dir) {
              let o = n.left - t.left,
                i = r.left - o,
                s = e.left - i,
                a = e.width + s,
                d = Math.max(a, t.width),
                u = window.innerWidth - 10,
                p = (0, l.clamp)(i, [10, Math.max(10, u - d)]);
              ((c.style.minWidth = a + "px"), (c.style.left = p + "px"));
            } else {
              let o = t.right - n.right,
                i = window.innerWidth - r.right - o,
                s = window.innerWidth - e.right - i,
                a = e.width + s,
                d = Math.max(a, t.width),
                u = window.innerWidth - 10,
                p = (0, l.clamp)(i, [10, Math.max(10, u - d)]);
              ((c.style.minWidth = a + "px"), (c.style.right = p + "px"));
            }
            let o = y(),
              s = window.innerHeight - 20,
              a = S.scrollHeight,
              u = window.getComputedStyle(f),
              p = parseInt(u.borderTopWidth, 10),
              h = parseInt(u.paddingTop, 10),
              m = parseInt(u.borderBottomWidth, 10),
              v = p + h + a + parseInt(u.paddingBottom, 10) + m,
              w = Math.min(5 * C.offsetHeight, v),
              g = window.getComputedStyle(S),
              R = parseInt(g.paddingTop, 10),
              j = parseInt(g.paddingBottom, 10),
              k = e.top + e.height / 2 - 10,
              E = C.offsetHeight / 2,
              N = p + h + (C.offsetTop + E);
            if (N <= k) {
              let e = o.length > 0 && C === o[o.length - 1].ref.current;
              c.style.bottom = "0px";
              let t = Math.max(
                s - k,
                E +
                  (e ? j : 0) +
                  (f.clientHeight - S.offsetTop - S.offsetHeight) +
                  m,
              );
              c.style.height = N + t + "px";
            } else {
              let e = o.length > 0 && C === o[0].ref.current;
              c.style.top = "0px";
              let t = Math.max(k, p + S.offsetTop + (e ? R : 0) + E);
              ((c.style.height = t + (v - N) + "px"),
                (S.scrollTop = N - k + S.offsetTop));
            }
            ((c.style.margin = "10px 0"),
              (c.style.minHeight = w + "px"),
              (c.style.maxHeight = s + "px"),
              i?.(),
              requestAnimationFrame(() => (x.current = !0)));
          }
        }, [y, d.trigger, d.valueNode, c, f, S, C, b, d.dir, i]);
      (0, g.useLayoutEffect)(() => j(), [j]);
      let [k, E] = r.useState();
      (0, g.useLayoutEffect)(() => {
        f && E(window.getComputedStyle(f).zIndex);
      }, [f]);
      let N = r.useCallback(
        (e) => {
          e && !0 === w.current && (j(), R?.(), (w.current = !1));
        },
        [j, R],
      );
      return (0, t.jsx)(Q, {
        scope: o,
        contentWrapper: c,
        shouldExpandOnScrollRef: x,
        onScrollButtonChange: N,
        children: (0, t.jsx)("div", {
          ref: p,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: k,
          },
          children: (0, t.jsx)(v.Primitive.div, {
            ...a,
            ref: m,
            style: { boxSizing: "border-box", maxHeight: "100%", ...a.style },
          }),
        }),
      });
    });
    $.displayName = "SelectItemAlignedPosition";
    var J = r.forwardRef((e, r) => {
      let {
          __scopeSelect: n,
          align: l = "start",
          collisionPadding: o = 10,
          ...i
        } = e,
        s = M(n);
      return (0, t.jsx)(h.Content, {
        ...s,
        ...i,
        ref: r,
        align: l,
        collisionPadding: o,
        style: {
          boxSizing: "border-box",
          ...i.style,
          "--radix-select-content-transform-origin":
            "var(--radix-popper-transform-origin)",
          "--radix-select-content-available-width":
            "var(--radix-popper-available-width)",
          "--radix-select-content-available-height":
            "var(--radix-popper-available-height)",
          "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-select-trigger-height": "var(--radix-popper-anchor-height)",
        },
      });
    });
    J.displayName = "SelectPopperPosition";
    var [Q, ee] = I(W, {}),
      et = "SelectViewport",
      er = r.forwardRef((e, n) => {
        let { __scopeSelect: l, nonce: i, ...a } = e,
          d = G(et, l),
          u = ee(et, l),
          c = (0, s.useComposedRefs)(n, d.onViewportChange),
          p = r.useRef(0);
        return (0, t.jsxs)(t.Fragment, {
          children: [
            (0, t.jsx)("style", {
              dangerouslySetInnerHTML: {
                __html:
                  "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}",
              },
              nonce: i,
            }),
            (0, t.jsx)(N.Slot, {
              scope: l,
              children: (0, t.jsx)(v.Primitive.div, {
                "data-radix-select-viewport": "",
                role: "presentation",
                ...a,
                ref: c,
                style: {
                  position: "relative",
                  flex: 1,
                  overflow: "hidden auto",
                  ...a.style,
                },
                onScroll: (0, o.composeEventHandlers)(a.onScroll, (e) => {
                  let t = e.currentTarget,
                    { contentWrapper: r, shouldExpandOnScrollRef: n } = u;
                  if (n?.current && r) {
                    let e = Math.abs(p.current - t.scrollTop);
                    if (e > 0) {
                      let n = window.innerHeight - 20,
                        l = Math.max(
                          parseFloat(r.style.minHeight),
                          parseFloat(r.style.height),
                        );
                      if (l < n) {
                        let o = l + e,
                          i = Math.min(n, o),
                          s = o - i;
                        ((r.style.height = i + "px"),
                          "0px" === r.style.bottom &&
                            ((t.scrollTop = s > 0 ? s : 0),
                            (r.style.justifyContent = "flex-end")));
                      }
                    }
                  }
                  p.current = t.scrollTop;
                }),
              }),
            }),
          ],
        });
      });
    er.displayName = et;
    var en = "SelectGroup",
      [el, eo] = I(en);
    r.forwardRef((e, r) => {
      let { __scopeSelect: n, ...l } = e,
        o = (0, f.useId)();
      return (0, t.jsx)(el, {
        scope: n,
        id: o,
        children: (0, t.jsx)(v.Primitive.div, {
          role: "group",
          "aria-labelledby": o,
          ...l,
          ref: r,
        }),
      });
    }).displayName = en;
    var ei = "SelectLabel",
      es = r.forwardRef((e, r) => {
        let { __scopeSelect: n, ...l } = e,
          o = eo(ei, n);
        return (0, t.jsx)(v.Primitive.div, { id: o.id, ...l, ref: r });
      });
    es.displayName = ei;
    var ea = "SelectItem",
      [ed, eu] = I(ea),
      ec = r.forwardRef((e, n) => {
        let {
            __scopeSelect: l,
            value: i,
            disabled: a = !1,
            textValue: d,
            ...u
          } = e,
          c = H(ea, l),
          p = G(ea, l),
          h = c.value === i,
          [m, y] = r.useState(d ?? ""),
          [x, w] = r.useState(!1),
          g = (0, s.useComposedRefs)(n, (e) => p.itemRefCallback?.(e, i, a)),
          S = (0, f.useId)(),
          C = r.useRef("touch"),
          b = () => {
            a || (c.onValueChange(i), c.onOpenChange(!1));
          };
        if ("" === i)
          throw Error(
            "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.",
          );
        return (0, t.jsx)(ed, {
          scope: l,
          value: i,
          disabled: a,
          textId: S,
          isSelected: h,
          onItemTextChange: r.useCallback((e) => {
            y((t) => t || (e?.textContent ?? "").trim());
          }, []),
          children: (0, t.jsx)(N.ItemSlot, {
            scope: l,
            value: i,
            disabled: a,
            textValue: m,
            children: (0, t.jsx)(v.Primitive.div, {
              role: "option",
              "aria-labelledby": S,
              "data-highlighted": x ? "" : void 0,
              "aria-selected": h && x,
              "data-state": h ? "checked" : "unchecked",
              "aria-disabled": a || void 0,
              "data-disabled": a ? "" : void 0,
              tabIndex: a ? void 0 : -1,
              ...u,
              ref: g,
              onFocus: (0, o.composeEventHandlers)(u.onFocus, () => w(!0)),
              onBlur: (0, o.composeEventHandlers)(u.onBlur, () => w(!1)),
              onClick: (0, o.composeEventHandlers)(u.onClick, () => {
                "mouse" !== C.current && b();
              }),
              onPointerUp: (0, o.composeEventHandlers)(u.onPointerUp, () => {
                "mouse" === C.current && b();
              }),
              onPointerDown: (0, o.composeEventHandlers)(
                u.onPointerDown,
                (e) => {
                  C.current = e.pointerType;
                },
              ),
              onPointerMove: (0, o.composeEventHandlers)(
                u.onPointerMove,
                (e) => {
                  ((C.current = e.pointerType),
                    a
                      ? p.onItemLeave?.()
                      : "mouse" === C.current &&
                        e.currentTarget.focus({ preventScroll: !0 }));
                },
              ),
              onPointerLeave: (0, o.composeEventHandlers)(
                u.onPointerLeave,
                (e) => {
                  e.currentTarget === document.activeElement &&
                    p.onItemLeave?.();
                },
              ),
              onKeyDown: (0, o.composeEventHandlers)(u.onKeyDown, (e) => {
                (p.searchRef?.current === "" || " " !== e.key) &&
                  (k.includes(e.key) && b(),
                  " " === e.key && e.preventDefault());
              }),
            }),
          }),
        });
      });
    ec.displayName = ea;
    var ep = "SelectItemText",
      ef = r.forwardRef((e, l) => {
        let { __scopeSelect: o, className: i, style: a, ...d } = e,
          u = H(ep, o),
          c = G(ep, o),
          p = eu(ep, o),
          f = O(ep, o),
          [h, m] = r.useState(null),
          y = (0, s.useComposedRefs)(
            l,
            (e) => m(e),
            p.onItemTextChange,
            (e) => c.itemTextRefCallback?.(e, p.value, p.disabled),
          ),
          x = h?.textContent,
          w = r.useMemo(
            () =>
              (0, t.jsx)(
                "option",
                { value: p.value, disabled: p.disabled, children: x },
                p.value,
              ),
            [p.disabled, p.value, x],
          ),
          { onNativeOptionAdd: S, onNativeOptionRemove: C } = f;
        return (
          (0, g.useLayoutEffect)(() => (S(w), () => C(w)), [S, C, w]),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(v.Primitive.span, { id: p.textId, ...d, ref: y }),
              p.isSelected && u.valueNode && !u.valueNodeHasChildren
                ? n.createPortal(d.children, u.valueNode)
                : null,
            ],
          })
        );
      });
    ef.displayName = ep;
    var eh = "SelectItemIndicator",
      em = r.forwardRef((e, r) => {
        let { __scopeSelect: n, ...l } = e;
        return eu(eh, n).isSelected
          ? (0, t.jsx)(v.Primitive.span, { "aria-hidden": !0, ...l, ref: r })
          : null;
      });
    em.displayName = eh;
    var ev = "SelectScrollUpButton",
      ey = r.forwardRef((e, n) => {
        let l = G(ev, e.__scopeSelect),
          o = ee(ev, e.__scopeSelect),
          [i, a] = r.useState(!1),
          d = (0, s.useComposedRefs)(n, o.onScrollButtonChange);
        return (
          (0, g.useLayoutEffect)(() => {
            if (l.viewport && l.isPositioned) {
              let e = function () {
                  a(t.scrollTop > 0);
                },
                t = l.viewport;
              return (
                e(),
                t.addEventListener("scroll", e),
                () => t.removeEventListener("scroll", e)
              );
            }
          }, [l.viewport, l.isPositioned]),
          i
            ? (0, t.jsx)(eg, {
                ...e,
                ref: d,
                onAutoScroll: () => {
                  let { viewport: e, selectedItem: t } = l;
                  e && t && (e.scrollTop = e.scrollTop - t.offsetHeight);
                },
              })
            : null
        );
      });
    ey.displayName = ev;
    var ex = "SelectScrollDownButton",
      ew = r.forwardRef((e, n) => {
        let l = G(ex, e.__scopeSelect),
          o = ee(ex, e.__scopeSelect),
          [i, a] = r.useState(!1),
          d = (0, s.useComposedRefs)(n, o.onScrollButtonChange);
        return (
          (0, g.useLayoutEffect)(() => {
            if (l.viewport && l.isPositioned) {
              let e = function () {
                  let e = t.scrollHeight - t.clientHeight;
                  a(Math.ceil(t.scrollTop) < e);
                },
                t = l.viewport;
              return (
                e(),
                t.addEventListener("scroll", e),
                () => t.removeEventListener("scroll", e)
              );
            }
          }, [l.viewport, l.isPositioned]),
          i
            ? (0, t.jsx)(eg, {
                ...e,
                ref: d,
                onAutoScroll: () => {
                  let { viewport: e, selectedItem: t } = l;
                  e && t && (e.scrollTop = e.scrollTop + t.offsetHeight);
                },
              })
            : null
        );
      });
    ew.displayName = ex;
    var eg = r.forwardRef((e, n) => {
        let { __scopeSelect: l, onAutoScroll: i, ...s } = e,
          a = G("SelectScrollButton", l),
          d = r.useRef(null),
          u = P(l),
          c = r.useCallback(() => {
            null !== d.current &&
              (window.clearInterval(d.current), (d.current = null));
          }, []);
        return (
          r.useEffect(() => () => c(), [c]),
          (0, g.useLayoutEffect)(() => {
            let e = u().find((e) => e.ref.current === document.activeElement);
            e?.ref.current?.scrollIntoView({ block: "nearest" });
          }, [u]),
          (0, t.jsx)(v.Primitive.div, {
            "aria-hidden": !0,
            ...s,
            ref: n,
            style: { flexShrink: 0, ...s.style },
            onPointerDown: (0, o.composeEventHandlers)(s.onPointerDown, () => {
              null === d.current && (d.current = window.setInterval(i, 50));
            }),
            onPointerMove: (0, o.composeEventHandlers)(s.onPointerMove, () => {
              (a.onItemLeave?.(),
                null === d.current && (d.current = window.setInterval(i, 50)));
            }),
            onPointerLeave: (0, o.composeEventHandlers)(
              s.onPointerLeave,
              () => {
                c();
              },
            ),
          })
        );
      }),
      eS = r.forwardRef((e, r) => {
        let { __scopeSelect: n, ...l } = e;
        return (0, t.jsx)(v.Primitive.div, { "aria-hidden": !0, ...l, ref: r });
      });
    eS.displayName = "SelectSeparator";
    var eC = "SelectArrow";
    r.forwardRef((e, r) => {
      let { __scopeSelect: n, ...l } = e,
        o = M(n),
        i = H(eC, n),
        s = G(eC, n);
      return i.open && "popper" === s.position
        ? (0, t.jsx)(h.Arrow, { ...o, ...l, ref: r })
        : null;
    }).displayName = eC;
    var eb = r.forwardRef(({ __scopeSelect: e, value: n, ...l }, o) => {
      let i = r.useRef(null),
        a = (0, s.useComposedRefs)(o, i),
        d = (0, S.usePrevious)(n);
      return (
        r.useEffect(() => {
          let e = i.current;
          if (!e) return;
          let t = Object.getOwnPropertyDescriptor(
            window.HTMLSelectElement.prototype,
            "value",
          ).set;
          if (d !== n && t) {
            let r = new Event("change", { bubbles: !0 });
            (t.call(e, n), e.dispatchEvent(r));
          }
        }, [d, n]),
        (0, t.jsx)(v.Primitive.select, {
          ...l,
          style: { ...C.VISUALLY_HIDDEN_STYLES, ...l.style },
          ref: a,
          defaultValue: n,
        })
      );
    });
    function eR(e) {
      return "" === e || void 0 === e;
    }
    function ej(e) {
      let t = (0, x.useCallbackRef)(e),
        n = r.useRef(""),
        l = r.useRef(0),
        o = r.useCallback(
          (e) => {
            let r = n.current + e;
            (t(r),
              (function e(t) {
                ((n.current = t),
                  window.clearTimeout(l.current),
                  "" !== t &&
                    (l.current = window.setTimeout(() => e(""), 1e3)));
              })(r));
          },
          [t],
        ),
        i = r.useCallback(() => {
          ((n.current = ""), window.clearTimeout(l.current));
        }, []);
      return (
        r.useEffect(() => () => window.clearTimeout(l.current), []),
        [n, o, i]
      );
    }
    function ek(e, t, r) {
      var n, l;
      let o = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t,
        i = r ? e.indexOf(r) : -1,
        s =
          ((n = e),
          (l = Math.max(i, 0)),
          n.map((e, t) => n[(l + t) % n.length]));
      1 === o.length && (s = s.filter((e) => e !== r));
      let a = s.find((e) =>
        e.textValue.toLowerCase().startsWith(o.toLowerCase()),
      );
      return a !== r ? a : void 0;
    }
    eb.displayName = "SelectBubbleInput";
    var eE = e.i(506703),
      eN = e.i(820268),
      eP = e.i(890055),
      eT = e.i(647163);
    let eI = r.forwardRef(({ className: e, children: r, ...n }, l) =>
      (0, t.jsxs)(B, {
        ref: l,
        className: (0, eT.cn)(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          e,
        ),
        ...n,
        children: [
          r,
          (0, t.jsx)(K, {
            asChild: !0,
            children: (0, t.jsx)(eN.ChevronDown, {
              className: "h-4 w-4 opacity-50",
            }),
          }),
        ],
      }),
    );
    eI.displayName = B.displayName;
    let eA = r.forwardRef(({ className: e, ...r }, n) =>
      (0, t.jsx)(ey, {
        ref: n,
        className: (0, eT.cn)(
          "flex cursor-default items-center justify-center py-1",
          e,
        ),
        ...r,
        children: (0, t.jsx)(eP.ChevronUp, { className: "h-4 w-4" }),
      }),
    );
    eA.displayName = ey.displayName;
    let eM = r.forwardRef(({ className: e, ...r }, n) =>
      (0, t.jsx)(ew, {
        ref: n,
        className: (0, eT.cn)(
          "flex cursor-default items-center justify-center py-1",
          e,
        ),
        ...r,
        children: (0, t.jsx)(eN.ChevronDown, { className: "h-4 w-4" }),
      }),
    );
    eM.displayName = ew.displayName;
    let eD = r.forwardRef(
      ({ className: e, children: r, position: n = "popper", ...l }, o) =>
        (0, t.jsx)(U, {
          children: (0, t.jsxs)(q, {
            ref: o,
            className: (0, eT.cn)(
              "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
              "popper" === n &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
              e,
            ),
            position: n,
            ...l,
            children: [
              (0, t.jsx)(eA, {}),
              (0, t.jsx)(er, {
                className: (0, eT.cn)(
                  "p-1",
                  "popper" === n &&
                    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
                ),
                children: r,
              }),
              (0, t.jsx)(eM, {}),
            ],
          }),
        }),
    );
    ((eD.displayName = q.displayName),
      (r.forwardRef(({ className: e, ...r }, n) =>
        (0, t.jsx)(es, {
          ref: n,
          className: (0, eT.cn)("px-2 py-1.5 text-sm font-semibold", e),
          ...r,
        }),
      ).displayName = es.displayName));
    let eH = r.forwardRef(({ className: e, children: r, ...n }, l) =>
      (0, t.jsxs)(ec, {
        ref: l,
        className: (0, eT.cn)(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          e,
        ),
        ...n,
        children: [
          (0, t.jsx)("span", {
            className:
              "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
            children: (0, t.jsx)(em, {
              children: (0, t.jsx)(eE.Check, { className: "h-4 w-4" }),
            }),
          }),
          (0, t.jsx)(ef, { children: r }),
        ],
      }),
    );
    ((eH.displayName = ec.displayName),
      (r.forwardRef(({ className: e, ...r }, n) =>
        (0, t.jsx)(eS, {
          ref: n,
          className: (0, eT.cn)("-mx-1 my-1 h-px bg-muted", e),
          ...r,
        }),
      ).displayName = eS.displayName),
      e.s(
        [
          "Select",
          0,
          z,
          "SelectContent",
          0,
          eD,
          "SelectItem",
          0,
          eH,
          "SelectTrigger",
          0,
          eI,
          "SelectValue",
          0,
          F,
        ],
        62870,
      ));
  },
]);
