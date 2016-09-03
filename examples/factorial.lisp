(let ((f (lambda (n)
       (if (< n 2)
        1
        (* n (f (- n 1)))))))
  (f 4))
