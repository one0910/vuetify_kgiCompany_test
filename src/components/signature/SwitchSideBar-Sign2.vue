<script setup>
import { computed, onMounted, toRefs, watch } from 'vue';
import { useInsureanceStore } from '@/stores/signature2';

const store = useInsureanceStore();
const currentPage = computed(() => store.currentPage);
const props = defineProps(['showFakeSign']);
const { showFakeSign } = toRefs(props);

async function signatueTest(index) {
  const roleIndex = store.currentRole.index;
  const signatrueRole = store.signatureRoleType[roleIndex].pageData[index.toString()];
  const currentDocIndex = signatrueRole.pageIndex;
  const currentDocSigIndex = signatrueRole.sigIndex;

  // 更新 base64
  const fakeBase64 =
    'data:image/png;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAChAb4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAor8+P+CjP/Btt8EP+CnX7Sl38UvH/jL4x6brt3ZW9gbPRdbs00+COFNi+VFcWk5j3AZYIwUsS23czE+Ef8QVP7LH/Q/ftAf+DzSP/lZQB+v1Ffhz8R/+DXD9gP4NfEOy8I+JP2lfHHhDxtqKo+m6RrHj/wAOWeozs5xE0dtJYpK4LDA2jkjAOa9Ds/8Ag2k/aJ8KWy6d4Y/4KQ/HvQfD9n+7sNOjh1PbZxD7qDy9ZjTj/ZRR7CgD9g6K/IH/AIhxP2p/+knH7QH/AH51f/5eVDa/8E2f+CrnwVL6N4A/bQ+HviTw/H/qrzxfY+fqL/7xuNMvnHH/AE3NAH7CUV+QP/DG/wDwWS/6Ox/Z/wD/AAUWv/zPVW1j9mH/AILL+B9Mm1eH9oz4EeMpdOXz10O30yyil1Qj/lirSaLboC3q00Y/2hQB+w9Ffj/H+2N/wWTSNVP7KHwBcgYLHV7XLe5x4hxTv+GyP+CyX/Rp37P/AP4N7X/5oaAP1+or8gf+GyP+CyX/AEad+z//AODe1/8Amho/4bI/4LJf9Gnfs/8A/g3tf/mhoA/X6ivyB/4bI/4LJf8ARp37P/8A4N7X/wCaGj/hsj/gsl/0ad+z/wD+De1/+aGgD9fqK/Hax8Ef8FmP2ndQvNck8YfAr9nSOFlgj8PSw2N9HOAOZkdbbVWAJ6h7hTnouKjb/gj1/wAFKf2ofEyN8Zf27YPAthpdsRYTfDZbqCS5kLDKzwWkWkowxkh2eRhjAUA5AB+xtFeB/wDBN79knx5+xX+zkPBXxE+Nnir4968mpz3sfiXxBbtDdxQOsYS1G+eeRkQo7BpJXbMrDhQqj3ygAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPzY/4Lg/8G7vgj/gp94b1jxr4HttF8H/tA3M1m6+JdQvL0WWrW9vE0ItLmKNnjQGMoRMkDSgwRrkrkVzf/BET/gqt8ZfG/wC1P8R/2Vf2tXsoPjp4LJv9G1COyhs18R2igmYAQJHA21DFNE8aL5kUjkgGIk/qXX44f8F157f9j3/gud+wn+0DbzQ2H9vanL4H1+8uRstLKw+0RwPLI/QN9m1m9OT2gHZeAD9j6KKKACiiigAooooAKKKKACiiigAoor86/wDguj8KP2wtAtrT42fsvfF8eG7H4beGb6fxB4KntY7hNYSLdO9xbwyQTR3FyYwUEcgUgRr5TB3IYA/RSivjn/ghl/wU8T/gqt+wdo3jvUlsLTx3ol1LoXi2xtFKRQ30WGWWNW5Ec0DxSjGVVnkQE+WTX2NQAUUUUAFFflL/AMHhvjPxd4C/4JdeFNT8I6pr+jzW/wAS9LbULvSriWBorcWWoshkeMgqguVtiCTjzBF321+mvwX+LWi/H34O+E/Hfhuaa58O+NdGs9e0uWWIxSS2t1Ak8LMh5UmORSQeQeKAOlooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooriP2iv2kvAv7JXwi1Xx58R/E2m+EvCWiIHu9QvWOxSeFRFUF5JGPCois7HgAmgDt6K/Kr9qD/g8C/ZQ+DWgFvAM3jH4waxPbSSW8OlaPNpNlFMPux3E9+sMiBv70UM2B2zxXqn/BFn/gvZoP/BXbxZ498JXvgC5+FPj3wLFFeSaFd60NSkvrVpGillQmCB1MMvlpIrR/KZ4uTkgAH6A0UUUAFFFFABRRRQAUUUUAFfnd/wAHTfwFsfjX/wAEYPiXfvo39ra34DuNN8R6TIq5ksWS+hhuZh7Cynutw6Y57Cv0Rr5//wCCsiB/+CWP7SwYAj/hVfig8juNIuiKAE/4JQfGI/H7/gmX8BPFs2sSa/qGq+A9IGp6hI++S5v4rSOG8Lnu4uY5g3+0DX0DXwB/wa4/8oKPgZ/3H/8A1IdTr7/oAKKKKACiiigAooooAKKKKACiiigD8ZP+DYjwroHwn/4KQf8ABRjwZoFvZaPpOg/EKCx0jSoWCrbWVtqniCFEjQnOyNTEmecZUE8iv2br8NfCfjDQv+CX3/B2/wDEC/8AE/g7xD4d8HftLaZa+HPB9/ZaeWsdS1jUpNFluLguzAFG1CK5WUpuZJJ1JUK24fuVQAUUUUAeEf8ABTL9h20/4KRfsO+PPgte+IbjwpD41htVXVobQXbWMtteQXkbGEunmL5lugZd6kqThgcGviH/AIM/Pj54t+OH/BLLWLPxd4k1HxFJ4F8bXHhrRkvp/Nl0vS4dM017e1Un5hEjSShAeFX5RhVAH6q1+OP/AAbTppvgn/gpj/wUe8Iae9tp1hpvxKX+ytIjkCJBbxarr0TGKLPCKv2dCQMAeWD/AA0AfsdRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFfjN/wVW/4Kf/ABs/bK/4KRaF+xj+xv8AEXwx4b1O90q6bxV4ximdks7uO3nuJbQXsMU7WwiiiRTLAvmC4nWIvGUYUAesf8Fdf+DmD4Y/sU6f4m+Hfwluo/iV8fbG/bQV0eGyuHsNEvN2xjPLsCTyIx2+RCzMZBsYpg14N+y9/wAG0nxd/bU8TeFvid+3d8ZvGPjK7hubm8uPhs+pSXcVksjZWEX8V0YrZGIy8NnGAFChZVP3ftP/AII6/wDBDnwX/wAEsdG1bxLf6xd/EX4yeNI4pvEnirVI45mhn/etMlizJ50UUjTMZGd2eYojPjCov3PQB5X+zx+w18GP2SX834Y/Cr4feArx7JNOmvdD0G2s727gTG1JrhEEs3KgkyMxZhuJJ5r8d/8AgvL8BPE//BHz/goX4X/b2+HXjS+tdL8e+L9L8P8Ai/wjYwLZfboUtUlntzKrbZobyPTHaRXjBSbbJuZiCn7uV+b3/B2H8L9J8f8A/BEz4iatqMJlvPBGr6JrelsD/qrl9SgsGb/vxezr/wACoA/SGivG/wDgnX8RdW+L/wDwT7+BXi3Xrk3mu+KPh7oGr6jcHrPc3Gm28sr/AIu7H8a9koAKKKKACiiigAooooAK+V/+C4Xxd0n4Jf8ABIb9ovWdaMws73wLqOgR+Uu5vtOpRHTrbj08+6iyewya+qK/Hv8A4Oi/2pNd+LfiX4RfsM+AzYr4l/aJ1TTZNeuru1lkXTbA6pElk4Kg4Q3VvLLIygskdkeMPmgD6j/4NuPhprPwn/4IkfATS9es2sb660u+1mKNiCWtb/VLy+tZOOz29xC//A6+4a4T9lz4Hwfsx/sy/Dr4bW2oS6tbfD3wxpvhqK+ljET3iWVpFbCVlBIUsIwxAJxnFd3QAUUUUAFFFFABRRRQAUUUUAFFFFAH4/f8HJ1wmi/8FK/+Camr3bC20vTfim73d3J8sNuP7V8Ovl26D5Y3PPZG9K/YGvx+/wCD0+3S1/4JnfDfVIlEWpWPxTsEt7pPlmgDaVqrMFYcrlo4zx3RT2FfsDQAUUUUAFfjx+xBo1poH/B4z+1pb2Nrb2cEnwxtrl44IxGjSyw+FpZZCBwWeR3dj1LOxPJNfsPX84n7Z/7VPx2/Zc/4OrfjpD+zl4P0Hxv8VPiToGl+EdO07VoWkiWN9D0a8lnT9/AivGLHdvlfylVXLggcAH9E/jXxvovw28KX+veI9X0vQND0uIz3uo6ldR2tpZxjq8kshCIo9WIFfA37YX/B0N+yJ+yLfw2MXjW++K2pvJsltvh9BBq8duuM72unmitWHbEczNn+HvXyB+zd/wAGnvin9q74jeMvil+278R9W1jx34vvrbVoLXwTrMS7GcO9zBetNZFFAJijSO0IjjWNwrkFNv6i/si/8EnP2cf2Er+G++Ffwh8I+GdZtw6xay8D3+rxK6lXVb25aS4VWBIKiQAjjFAH5zeEf+Dmn9oz9snSLtv2cP2HPG3iewvb6Wx0bxVqV/c3WjlkP/Lz5VrFbxuAVLJ9tAUnG89a1tb1T/gsb+1lZS6JceHvgh+zvaXS/ZptTs7y3mmCN96RGS51F0bBIBRVYY4wcGv2KooA/H20/wCDcz9rC7tIpbz/AIKZ/HiC8lQPPFAmrvFHIRllRv7aTKg5AO1cj+EdKk/4hxP2p/8ApJx+0B/351f/AOXlfr9RQB+QP/EOJ+1P/wBJOP2gP+/Or/8Ay8ryn9sX/gg5+3x8GfhANa+EX7b3x5+NXipb6KB/Dj+Jr7w0xtmD750ubjWHiLIwT9223IZiGyoVv3UooA/KT/gjN/wTl/b/AP2R/wBo/T/Efx1/aA0nx78NNX0uVda8N6p4s1bxJqdvO0JMAha6hEUEkcxXe8UzIyq6gPlXX9W6KKACiiigAooooAKKKKACiiigAooooAK+W/2DP+CpXh39vX9pX9ov4baL4Z1fQ7z9nfxMnhq/vbyeOSLWHaa8gMsarygEthOMNnKmNsgsVX6kr8gf+DcT/lKb/wAFOP8Asqqf+nfxJQB7H/wdEft+eLv2CP8Agmibr4f6zL4f8ZfELxFa+GLTU7S78jUNKt2hnubi5tyPmDbbYQ7xgp9pDAhgprtP+CHf/BFDw9/wSD+DWrxXmq6d41+J3i+cXGt+Jo9ONs8MPlxY06Es7sbeOVXfedrSs+5lXaip8NXOn67/AMHBf/BfuVft2m6l+zP+x7rSTw7rNHh1a9Bh82DdhhcC5vbJvvHy/stscAM/z/uZQAUUUUAFfAH/AAdHf8oKPjn/ANwD/wBSHTK+/wCvgD/g6O/5QUfHP/uAf+pDplAH0B/wSd/5RZfs0/8AZKvC/wD6aLWvf68A/wCCTv8Ayiy/Zp/7JV4X/wDTRa17/QAUUUUAFFFFABRRRQAV+QP7ZH/K5J+yd/2Sq+/9JfFdfr9X44/G7xCvxx/4PNvg9beGbS/1I/Bv4a3Fp4tkSA+XpRm0/V5o5Gb/AJ5kaxp6bv79wF60AfqN+158cNc/Zs/Zr8X+OfDfgHxH8Udd8N2X2my8K6CpbUNZk3qvlxAKx4DFjtR22o21HbCn8yf+Ijv9qf8A6Rj/ALQH/f7V/wD5R1+v1FAH5A/8RHf7U/8A0jH/AGgP+/2r/wDyjo/4iO/2p/8ApGP+0B/3+1f/AOUdfr9RQB+QP/ER3+1P/wBIx/2gP+/2r/8Ayjo/4iO/2p/+kY/7QH/f7V//AJR1+v1FAH5A/wDER3+1P/0jH/aA/wC/2r//ACjo/wCIjv8Aan/6Rj/tAf8Af7V//lHX6/UUAfkHD/wcdftSNKok/wCCZH7QSoSNxWTV2IHcgf2GMn8RX6u/Cnxld/EX4XeG/EN/oWp+F7/XdKtdRudG1EKLzSJJoVka1mCkgSxMxRsHG5TW/RQAUUUUAfnP/wAHWvw+0bxn/wAEQ/ihqWp2EN5e+EtR0PVtIlfO6xun1a1s2lXH8Rt7u4j5zxK3fFfUP/BLbWbvxF/wTJ/Z01DULq4vr+++GHhq4ubmeQyS3Er6VbM7ux5ZmYkknkk187/8HR3/ACgo+Of/AHAP/Uh0yvoD/gk7/wAosv2af+yVeF//AE0WtAHv9FFFABX47/tdaLZ6X/weX/stz21rb28+pfDC9ubuSOMI11KLHxREHcjlmEccaZPO1FHQCv2Ir+eb/g5W+DnxY+Pf/BwL8FfDHwMvdQ0/4r3PwpjvPD09hqw0q6E1rdeILp1iuS6CN2ihkUFnVSWAJAJNAH9DNFfAv/BA7/gqtqH/AAUG+Beu+BfiBpOq6B8cfgWbbw545ttQwJb+4USQfbMYBWV5baYTR7f3cgI+6y199UAFFFFABRRRQAUUUUAFFFFABXmv7Vf7YHw1/Yl+E9741+KHjDRfCGg2cbsj31ykc1/IqF/Itoid88xAOI4wWPpXpVfKf/BXD/gkn4A/4K5fs8Dwj4rlbQ/E+il5/C3iiKKS4m8OzyNEZWEAljSeOVIgjxyHBGCpV1V1APgjSP8Ag5B/aU/4KKeP9V0b9iP9lseK9J0CX/S/EHja6CW7oUyqSKlxbW9rKcMVRryRnUZCjkDasfBH/BZj9p3ULzXJPGHwK/Z0jhZYI/D0sNjfRzgDmZHW21VgCeoe4U56Liu8/wCCrf8AwUI8Pf8ABAX/AIJXeC/hN8LfE/hi7+L2h6RpXhXQLN1tTeW8UcP+ka1c2AJwsgglO5gVae4Unf8ANn9Hf2ebjxlefAHwNN8RYLG2+IMvh+wfxPDZEG2i1Q20Zu1iwSPLE/mBcEjAHJoA/LH/AIY3/wCCyX/R2P7P/wD4KLX/AOZ6j/hjf/gsl/0dj+z/AP8Agotf/mer9fqKAPxl8UfDn/gtD+zhrmia5aePfg38frf7Qy3Xh6yt9KsoNgXIa4eez0yTYTwPIuN+eoA5rT+EX/BzJ8Rf2Yvjdovw4/bk+AV98DLjU5ruE+NLCK8fRZTCoOYLbZcG4iDNGjTW1zOoMqEgLk1+w9eUftf/ALD3wp/bz+F0/hD4r+CdE8X6U8ci20l3br9s0t3ADTWlwP3tvL8q/PGykgYORkEA9A8AePdG+KngXRvE3hzUrTWfD/iGyh1LTb+1ffBe20yCSOVG7qyMCD6GtevwS/4JW/tv/wDDgX9sL4q/sxfHyx+Inhf4OeIPGlyfhb4m1uxkbTobZbiWLzzLgBre4iNm7PACkUokLqu92X97aACv58P2SfjFbfAVf+C3XiafVJ9Glt9a1Kysb2ByksF9dX3ie0syjAgqxuZ4QCOQSDX9B9fyYftO/HW60j4lf8FEvgloEC6h4v8A2g/2hNM0GwscDzJ4bbxBr10zJ7/alsY/pMaAP3F/4Ndv2crH4Bf8Ea/hjff2BDo3iHx+b3xNrM4yZdT868mWzmYkng2KWgUDAA5xlmJ/QquF/Zf+CsP7Nf7NHw7+HVtcteW/gDwxpvhyK4brOlnaxW4c+5EYP413VABRRRQAV8Af8HR3/KCj45/9wD/1IdMr7/r87f8Ag6r8Z6V4X/4IefFmx1HULWzvPEd7oWnaXDK4V7+5XWLO5aKMfxMILaeTA/hic9qAPpP/AIJO/wDKLL9mn/slXhf/ANNFrXv9eAf8Enf+UWX7NP8A2Srwv/6aLWvf6ACiiigAooooAKKKKACvx/8A2M5Fl/4PI/2sSrKwHwrshkHPItvCoI/Ov1/dxGhZiFVRkknAAr8XP+DRvw5rH7Suv/tOftX+MpNJvfFfxR8Yf2IpiicTaa0ajULyNCxIW3kN9ZKiAkgWQB4AyAftJRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHwB/wdHf8oKPjn/3AP8A1IdMr6A/4JO/8osv2af+yVeF/wD00WtfP/8AwdHf8oKPjn/3AP8A1IdMr6A/4JO/8osv2af+yVeF/wD00WtAHv8ARRRQAV+QP7ZH/K5J+yd/2Sq+/wDSXxXX6/V+QP7ZH/K5J+yd/wBkqvv/AEl8V0AdJ/wVh/4Nh/Af7UuseLfi98EdR1b4b/H29vn8Qwyxam6aVrGolzLI7ggvbTSvkiWJlVXO5kOSRwf7BX/Bzfa/AdvDfwI/bP8AC3jz4e/GnRLpdF1XxJfadCul3KFiILy7+dZIdyFA0kccsT4ModVfC/stXgv/AAUT/wCCbnwv/wCCoHwEk+H3xQ068lsYrhbzTtU02SODVNGuBx5ttK6OqllyrBkZWB5U4GAD3qivw3k/4Jn/ALVP/Bu58Sr7x3+ypd6z+0P8EdYmVvEHw71CEyazCobAdI4F/fSgHi4tY1cbsPbuiZPsX7PX/B3P8HfFHxQ034ffGf4Z/En4EeO59WGkanDrCQT6VoEjOqKbu4la3uIQCcuXtQIxyTgEgA/Waiub+FPxk8IfHjwbB4j8D+KvDfjPw9cu0cOqaFqcOo2UrKcMqzQsyEg9QDxXSUAFFFFABRRRQAV4f/wUI/4KAfD7/gmx+zTrfxL+IOoRxWmnRlNP0uKeNL/Xro4CWtqjsN7knJxkIgZ2wqk17hX4uf8ABXj4V6X+2v8A8HOf7JHwP+IYn1v4YReC7nxM+hswFvPdL/bNxIHGDuSY6TZxyKfvRoVGM5oA5v8A4IUf8Esrb/gop8bviZ+2f+018PL67vvHnixdf+Hmh6/JdiC1tnY3SXgik2rdWgjltobbzN0ZS3c7CDGw/ceqnh/w/YeE9BstK0qytNM0vTLeO0s7O0hWGC0hjUKkcaKAqIqgAKAAAABVugAooooAKKKKAPx//wCD1eNT/wAEtvADlVLr8VNPAbHIB0jWMj9B+VfsBX44/wDB4bqd78Xvg5+zZ+z94e0173xn8X/iUk2iO8yRW/m28H2AQuzfdMkuswYY8ARvntX7HUAFfzaf8Etf2Am/bJ/4Ogv2gfF+q2ly/hD4H/FHxH4tu51U+U+prrlyNNty4+6xmV7gD+JbKQd6/pLr8gf+DcT/AJSm/wDBTj/sqqf+nfxJQB+v1FFFABRRRQAV+Mn/AAeaeL7nxr+zj+z/APBLQtF1PWvGnxN+IX9oaJBaIG+0PaWrWX2YDOTLLLrFuEA4O1skcZ/Zuvw2/a68P/FP/gp5/wAHUXhT4Vw694a0vwV+x/daN8Q7KC6gaOaa1J0C9vlR0RmluJpprdFEjJGiREjDbhIAfuBoui2fhvRrTTtOtLaw0+whS2tbW2iWKG2iRQqRoigBVVQAAAAAABVmiigAooooAKKKKACiiigD8+f+Do74uQ/Cj/gid8WI1119D1bxTNpOhaZ5czRS37yalbST2yEcndZw3ZZehjWQHjivS/8AghR+yb4R/ZH/AOCWvwgsPCuhz6HdeNfDOl+MfEazyyvNdaxfadavdSuJCShyqIEAAVY1GMgk+Cf8HcnwRtPiv/wRj8T69c3txazfDPxLo3iW1ijUFbyWS5/soxuT0UR6lI+RzujUdCa+0P8AgnL8Q9Z+Lv8AwT1+A/izxHfy6p4h8T/Dvw/q2qXsoAe8urjTbeWaVgABlndmOABzQB7NRRRQAUUUUAFFFFABRRRQAUUUUAFFfGn/AAWV/wCCvlt/wR7+G/gPxZqvw117x5oPi/Xm0W8u7G/js4tGIiMo3F0bzJpEWUxx4UMIJMyJgZ+xdO1G31fT4Lu0nhurW6jWaGaFw8cyMMqysOCpBBBHBBoA+b/+Cwn7Euvf8FF/+CcXxK+DfhfVtI0TxB4vhsTYXmqGQWcctrqFrehZTGruqv8AZ9m5VYrvztOMGH/gkN+zl8av2R/2H/DPw3+OfijwV4s8R+DFTR9FufDEUi2trotvbwwWdvI8kMLSyosbgyGNSVKAlmDO305RQAUUUUAFfj3+2tqNvpf/AAePfsmS3M8NvG3wuu4Q8rhFLvB4pRFyf4mdlUDqSwA5NfsJXh/xy/4JvfBP9pP9pfwL8YfG3gOx134kfDUwt4c1p7y6hksPJna4hzHHKsU3lzM0iCVH2sxIxk0Ae4UUUUAFeR/tm/sI/Cb/AIKEfCy28F/GHwfa+MvDllfpqdvbSXlzZyW9yiuiyJNbyRyqdsjqQHAIYggivXK/HX9s20/4KUf8FDf2zPjd8O/g3qlv8Afgh4YUaDZ3/ijT109fFCMgSS4s79LO4unMp8x1e3ZEjj2KzLLkMAfnN/wVs/4J5fsj/sffEbSfBf7KvxI+LnxA/aT1HxLBDpugaLq9rqtjoJMrAw+fbWySrcq4VEjE7yoRmQDhj/Qr/wAErP2WPih+yB+yHpPhT4wfFvxF8ZPG8051K81bWXeabTfNii3aek0kkkk8cMiybZZG3PvJ2ou1F8j/AOCOv/BB74W/8Eo/BthrcVrF4q+M99pzWuu+L53lO7zGV5Le0hZtkMIZQAwUSuBl2wQi/dVABRRRQAUUUUAFfkD+2R/yuSfsnf8AZKr7/wBJfFdfr9X4u/8ABSP4weFfgJ/wdz/sseKvG3iHSPCnhmx+GE8F1quq3SWtnbPOnie3i8yVyFQNLLGmWIALjJFAH7RUVDpupW2s6db3lncQXdpdxrNBPC4kjmRgCrqw4ZSCCCOCDU1ABRRRQAUUV+dH/Bev/gspqf8AwT70HQvhJ8L/AAtrHjj48fGDS7yDw9aaQWku9BDqYIL4W6RSPcSGYv5UKrh2t5MsAuGAPjz9mT9nPT/+CwH/AAc9/Hn4oeIZvE6+Bf2Xta02HRoY9VjUQa5plzDbWsexlYmzlm03U7krHsO7y9zfOwb92q/Pr/g28/4JveIP+CfP7B0l58QrK4tPiz8V9Vk8UeKEuwrXlkG+S1tJZASWZYw0zBvmSW7mU/dzX6C0AFfkD/wbif8AKU3/AIKcf9lVT/07+JK/X6vk/wD4J9f8ErdL/YE/af8A2lfiXp/jC+8Ry/tF+KY/E0+nz2C266EVmvrhoVkDsZsy382GKphVQYJBZgD6wooooAKKKKACvg//AIJt/wDBI/Xf2QP+Cjf7Ufx88a69oXivU/jLrTv4TuLeS4a+0XSJbmW5ms5/MUIORZRqELgLYoQy7ig+8KKACiiigAooooAKKKKACiiigDwj/gpl+w7af8FIv2HfHnwWvfENx4Uh8aw2qrq0NoLtrGW2vILyNjCXTzF8y3QMu9SVJwwODX5Ufs9+Gv8AgrX/AMEtfh9q3wv8G/DbwB8dvh54NkaHw7rmvapb3U66dDEFihtIhqltdLEI0ULbyRuyEbEyu0H9zqKAPxt8Ff8ABxh+2DYeFLCHxH/wTW+Nmq65HEBe3em2ut6faXEndo4JNJneNf8AZaVyP7xrU/4iO/2p/wDpGP8AtAf9/tX/APlHX6/UUAfkD/xEd/tT/wDSMf8AaA/7/av/APKOj/iI7/an/wCkY/7QH/f7V/8A5R1+v1FAH5A/8RHf7U//AEjH/aA/7/av/wDKOj/iI7/an/6Rj/tAf9/tX/8AlHX6/UUAfkD/AMRHf7U//SMf9oD/AL/av/8AKOj/AIiO/wBqf/pGP+0B/wB/tX/+Udfr9RQB+QP/ABEd/tT/APSMf9oD/v8Aav8A/KOj/iI7/an/AOkY/wC0B/3+1f8A+Udfr9RQB/P7+3D8Uf25f+DhLw9H8FLT9jv/AIUp4DS9stYm1nx/b39rcaRcxM6faYr25itlZSkro0VvaTTbHfGQTj9uf2Nfgle/s0fsg/Cr4cale22p6j8P/B+keG7q8twwhu5bOyht3kQN8wVmjJGecEZr0migAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvnT/AIKA/wDBKT4F/wDBTfw7Y2fxd8Fxa3qGjQTw6RrFrdzWOpaUZVIJjliZd4DYcRyiSLcoJQ19F0UAfg54I8Ef8FGv+CAl74l8K/DzwLN+1F+z7Z6jaLoUs/n6pqOn2eZP3FnZW1z9qtCQ+Jf9HmgRo1ZcAtu9W8Nf8HqP7PdvodvF4u+FXxx0DxPCDHqem2dhpt7BZTqSGjWaW8gkfBGMtDGc5G0Yr9jaKAPzY+Ef/B2b+xT8SPCg1HWfHfij4f3hkKf2Xr/hO/muwBj591hHdQ4P/XXPHQV0l7/wdK/sLWtnLKnxtluXjQssUfg3Xw8pAyFXdZBcnoMkD1Ir6h+Jf/BPD9n/AONHjK88R+MfgZ8HfFniHUCGutU1nwZpt/e3JAwC80sLOxx6k1hf8Onf2WP+jaf2f/8Aw3mkf/I9AH5rfE3/AIOwvE/7UczeFv2Mf2b/AIj/ABK8YqiyXd34g0d57fSkMoQSPaafNKzRNkDzZbiBUJGQRmvXP+CVf/BFX4o6b+13F+13+1n431DX/wBoAyXJ0jQdOvo5dK8OW09rNbNBIVUqxWO4lVIoHEMed26Vmyv6Z/D34c+HvhH4L0/w34U0HRvDHh3SY/JsdL0myisrKyTJOyKGNVRFyScKAMk1s0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/9k=';
  signatrueRole.signimg = fakeBase64;
  store.currentDocs[currentDocIndex].signature[currentDocSigIndex].signimg = fakeBase64;
  store.currentDocs[currentDocIndex].buttonStatus = 'signed';
  store.signatureRoleType[roleIndex].buttonStatus[currentDocIndex] = 'signed';

  // 檢查是否整個角色簽完
  const isRoleAllSignCheck = await store.checkRoleSignAll(roleIndex);
  if (isRoleAllSignCheck) {
    store.signatureRoleType[roleIndex].allSignedComplete = true;
  }

  console.log(`store.renderedCanvas => `, store.renderedCanvas.updateCanvasByIndex);
  console.log(`index => `, index);
  store.renderedCanvas.updateCanvasByIndex(index);
}

function skipHandler({ buttonStatus }, index) {
  store.currentPage = index;
  if (buttonStatus !== 'unselected') {
    store.skipToSignPosition(index.toString(), 'button');
  } else {
    store.scrollToPage(index);
  }
}
</script>

<template>
  <v-sheet height="450" class="bgPrimaryColor overflow-y-auto">
    <v-list class="bgPrimaryColor">
      <v-list-item v-for="(item, index) in store.currentDocs" :key="index" tag="div" class="px-0">
        <template v-slot>
          <div
            class="d-flex justify-center align-center cursor-pointer"
            @click="skipHandler(item, index)"
          >
            <v-avatar
              size="32"
              class="pa-3"
              :class="[
                index === currentPage ? 'border-active' : 'border-inactive',
                item.buttonStatus === 'signed'
                  ? 'bg-green'
                  : item.buttonStatus === 'unsigned'
                    ? 'bg-red'
                    : 'bg-transparent'
              ]"
            >
              <v-icon
                color="white"
                size="15"
                :icon="
                  item.buttonStatus === 'signed'
                    ? 'mdi-check'
                    : item.buttonStatus === 'unsigned'
                      ? 'mdi-pencil-outline'
                      : ''
                "
              />
            </v-avatar>

            <v-list-item-subtitle
              class="pl-3 text-subtitle-1"
              :class="index === currentPage ? 'text-blue-darken-4 font-weight-bold' : 'text-grey'"
            >
              0{{ index + 1 }}
              <span
                class="ml-2"
                @click="signatueTest(index)"
                v-if="showFakeSign && item.buttonStatus !== 'unselected'"
                >簽</span
              >
            </v-list-item-subtitle>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-sheet>

  <v-sheet
    class="d-flex flex-column mt-3 align-center bgPrimaryColor position-relative"
    height="120"
  >
    <div class="boxshadow"></div>
    <!-- 往上一個箭頭 -->
    <v-avatar
      color="white"
      size="54"
      class="mb-auto border-md"
      @click="store.switchSignButton({ type: 'last' })"
    >
      <v-icon icon="mdi-arrow-up"></v-icon>
    </v-avatar>

    <!-- 往下一個箭頭 -->
    <v-avatar
      color="white"
      size="54"
      class="border-md"
      @click="store.switchSignButton({ type: 'next' })"
    >
      <v-icon icon="mdi-arrow-down"></v-icon>
    </v-avatar>
  </v-sheet>
</template>

<style lang="scss" scoped>
.bgPrimaryColor {
  background-color: #f2f6ff;
}

.step--completed {
  border: 2px solid rgba(var(--v-theme-primary), 1);
}

.step--editing {
  border: 2px solid rgba(var(--v-theme-secondary), 1);
}

.border-active {
  border: 3px solid #1e88e5; // Vuetify 的 blue-darken-2
}

.border-inactive {
  border: 2px solid #ccc;
  /* background-color: #f00; */
}

.border-none {
  border: none;
}

.text-grey {
  color: #aaa; // 或 Vuetify 色階 grey-darken-1
}

.boxshadow {
  position: absolute;
  bottom: 100%;
  /* background: #f00; */
  height: 35px;
  width: 100%;
  &::after {
    content: '';
    display: inline-block;
    color: #000;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 10%;
    z-index: 3;
    box-shadow: inset 3px 26px 25px 2px #f2f6ff;
  }
  /* display: none; */
}
</style>
