
fun verificar(x) {
  if (!(x > 10) || x == 0) {
    print "x é pequeno ou zero";
  } else {
    print "x é maior que 10";
  }
  return true;
}

read valor;
verificar(valor);
