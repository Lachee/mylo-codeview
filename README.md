<table frame="void">
    <tr>
      <td width="200px">
        <img src="https://github.com/Lachee/chrome-mylo-codeview/blob/master/public/images/icons.png" align="center" width="100%" />
      </td>
      <td>
        <h1>MyLo Code View</h1>
        <p>
            <a href="https://github.com/Lachee/chrome-mylo-codeview/actions/workflows/package.yml"><img src="https://github.com/Lachee/chrome-mylo-codeview/actions/workflows/package.yml/badge.svg" alt="Create Package 📦" /></a>
        </p>
        <p>
          This Chrome extension will allow you to preview and highlight code within the browser while assessing students in MyLo.
        </p>
        <p>
          No more having to download 140+ python files, you can inspect it all in one place!
        </p>
      </td>
    </tr>
</table>

# Usage
With the extension installed, simply navigate to a assessing page and open a code source file like you would with any other submission material.

# Building
To build the extension yourself. First clone and navigate to the repository, then:

- **PNPM (prefered)** `pnpm i && pnpm build`
- **NPM** `npm i && npm run build`
  
# Installation
> First build or [download the artifact](https://github.com/Lachee/unity-utilities/actions/workflows/release.yml) of the extension. 

### Google Chrome
#### Chrome Store
This extension is not available on the chrome store. Being so specialised, I did not see the purpose of releasing it so publically. 
If there is demand for it, please let me know as I understand it can be a pain in the butt on Edge.

#### Manually
1. Go to [chrome://extensions](chrome://extensions)
2. In the top right, make sure Developer Mode is enabled
3. IN the top left, Load unpacked, then the built `dist/` folder or the unpacked .zip file

### Microsoft Edge
Edge will nag you about developer extensions, i do applogise.
1. Go to [edge://extensions](edge://extensions)
2. In the left navigation panel, enable developer mode
3. Load unpacked, then the built `dist/` folder or the unpacked .zip file
