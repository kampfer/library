/*
 * @Author : l.w.kampfer@gmail.com 
 */

kampfer.addDependency( 'base', 'base.js' );
kampfer.addDependency( 'browser.support', 'browser/support.js' );
kampfer.addDependency( 'data', 'data/data.js', 'browser.support' );

kampfer.addDependency( 'test', 'test/test.js', 'test1' );
kampfer.addDependency( 'test1', 'test/test1.js', 'data' );
