; just a test
(let ((identity (lambda (x) x))
      (data (list "hello"))
      (a 1)
      (b 2)
      (curried+
        (lambda (a)
          (lambda (b)
            (+ a b)))))
  (list
    ((curried+ a) b)
    (identity 30)
    "inc"
    (let ((increment (curried+ 1)))
      (increment 10))
    (eval (quote b))
    (quote (1 2))
    (+ 4 10)
    #t
    #f
    'a
    (quote a)
    "yup"))
; hello, world!
