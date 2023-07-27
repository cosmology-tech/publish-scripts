
import _rename from './commands/rename';
import _ignore from './commands/ignore';
import _copy from './commands/copy';
import _clean from './commands/clean';
const Commands = {};
Commands['rename'] = _rename;
Commands['ignore'] = _ignore;
Commands['copy'] = _copy;
Commands['clean'] = _clean;

  export { Commands }; 

  