// Arnés de Python: ejecuta el código del jugador en un espacio de nombres
// limpio, captura lo que imprime y evalúa las "sondas" (variables, llamadas
// a funciones y expresiones) que luego compara la validación.
//
// Se usa igual en el juego (Pyodide en un Web Worker) y en las pruebas
// (Pyodide en Node), así lo que se prueba es lo mismo que se juega.

export const CODIGO_HARNESS = String.raw`
import sys, io, json, math, traceback, builtins

_ARCHIVO = "<tu código>"

def _sin_input(*args, **kwargs):
    raise RuntimeError("input() no está disponible en el juego: usa variables con los datos del ejercicio.")

def _ser(v, d=0):
    if d > 8:
        return {"t": "otro", "v": repr(v)[:200]}
    if v is None:
        return {"t": "none"}
    if isinstance(v, bool):
        return {"t": "bool", "v": v}
    if isinstance(v, int):
        return {"t": "int", "v": v if abs(v) < 2**53 else float(v)}
    if isinstance(v, float):
        if math.isnan(v):
            return {"t": "float", "v": "nan"}
        if math.isinf(v):
            return {"t": "float", "v": "inf" if v > 0 else "-inf"}
        return {"t": "float", "v": v}
    if isinstance(v, str):
        return {"t": "str", "v": v[:5000]}
    if isinstance(v, list):
        return {"t": "list", "v": [_ser(x, d + 1) for x in v[:5000]]}
    if isinstance(v, tuple):
        return {"t": "tuple", "v": [_ser(x, d + 1) for x in v[:5000]]}
    if isinstance(v, dict):
        return {"t": "dict", "v": [[_ser(k, d + 1), _ser(x, d + 1)] for k, x in list(v.items())[:5000]]}
    if isinstance(v, (set, frozenset)):
        return {"t": "set", "v": [_ser(x, d + 1) for x in sorted(v, key=repr)[:5000]]}
    if callable(v):
        return {"t": "func", "v": getattr(v, "__name__", "?")}
    if hasattr(v, "item") and not hasattr(v, "__len__"):
        try:
            return _ser(v.item(), d + 1)
        except Exception:
            pass
    if hasattr(v, "tolist"):
        try:
            return _ser(v.tolist(), d + 1)
        except Exception:
            pass
    return {"t": "otro", "v": repr(v)[:500], "clase": type(v).__name__}

def _info_error(e):
    if isinstance(e, SyntaxError):
        return {"tipo": type(e).__name__, "mensaje": str(e.msg), "linea": e.lineno}
    linea = None
    for fr in traceback.extract_tb(e.__traceback__):
        if fr.filename == _ARCHIVO:
            linea = fr.lineno
    return {"tipo": type(e).__name__, "mensaje": str(e), "linea": linea}

def _ejecutar_juego(codigo, sondas_json, preludio=""):
    ns = {"__name__": "__main__", "input": _sin_input}
    salida = io.StringIO()
    anterior = sys.stdout
    sys.stdout = salida
    error = None
    try:
        if preludio:
            exec(compile(preludio, "<datos del ejercicio>", "exec"), ns)
        exec(compile(codigo, _ARCHIVO, "exec"), ns)
    except BaseException as e:
        error = _info_error(e)
    finally:
        sys.stdout = anterior
    sondas = {}
    if error is None:
        for s in json.loads(sondas_json):
            clave = s["clave"]
            sys.stdout = io.StringIO()
            try:
                if s["tipo"] == "variable":
                    if s["nombre"] not in ns:
                        sondas[clave] = {"ok": False, "falta": True}
                        continue
                    valor = ns[s["nombre"]]
                elif s["tipo"] == "expr":
                    valor = eval(s["codigo"], ns)
                elif s["tipo"] == "llamada":
                    f = ns.get(s["nombre"])
                    if f is None or not callable(f):
                        sondas[clave] = {"ok": False, "falta": True}
                        continue
                    valor = f(*s["args"])
                sondas[clave] = {"ok": True, "valor": _ser(valor)}
            except BaseException as e:
                sondas[clave] = {"ok": False, "error": _info_error(e)}
            finally:
                sys.stdout = anterior
    texto = salida.getvalue()
    if len(texto) > 20000:
        texto = texto[:20000] + "\n… (salida recortada)"
    return json.dumps({"stdout": texto, "error": error, "sondas": sondas})
`;

// Ejecuta con una instancia de Pyodide ya cargada (worker o Node).
export function ejecutarConPyodide(pyodide, codigo, sondas = [], preludio = '') {
  const fn = pyodide.globals.get('_ejecutar_juego');
  try {
    return JSON.parse(fn(codigo, JSON.stringify(sondas), preludio));
  } finally {
    fn.destroy?.();
  }
}
