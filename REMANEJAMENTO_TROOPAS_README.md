# 🚚 Sistema de Remanejamento de Tropas - Regras Implementadas

## 📋 Regras Principais

### 1. **Tropas Só Podem Ser Transferidas 1 Vez POR TURNO**
- Cada tropa transferida é rastreada individualmente **durante o turno atual**
- Uma vez movida, a tropa fica "travada" no seu destino **até o próximo turno**
- **A cada novo turno, todas as tropas voltam a ser "movíveis" novamente**
- Não é possível mover tropas que já foram movidas **no mesmo turno**

### 2. **Máximo de Tropas Transferíveis = Tropas Originais - 1**
- Sempre deve permanecer **1 tropa fixa** no território de origem
- Exemplo: Se um território tem 5 tropas, máximo de 4 podem ser movidas

### 3. **Tropas Já Transferidas Não Podem Ser Movidas Novamente NO MESMO TURNO**
- Se um território recebeu tropas movidas, essas tropas não podem ser movidas novamente **no mesmo turno**
- O sistema rastreia cada tropa individualmente para garantir essa regra
- **IMPORTANTE**: O território de destino NÃO limita o movimento - pode receber quantas tropas quiser

## 🔄 Exemplo de Funcionamento

### 🎯 **TURNO 1 - Jogador Azul**

#### Cenário Inicial:
- **Brasil**: 5 tropas (originais)
- **Uruguai**: 3 tropas (originais)
- **Chile**: 2 tropas (originais)

#### Movimento 1: Brasil → Uruguai (4 tropas)
- **Brasil**: 1 tropa (fixa) + 4 tropas movidas para Uruguai
- **Uruguai**: 3 tropas (originais) + 4 tropas movidas do Brasil = 7 tropas
- **Chile**: 2 tropas (originais)

#### Movimento 2: Uruguai → Chile (máximo 2 tropas)
- **Brasil**: 1 tropa (fixa)
- **Uruguai**: 3 tropas (originais) + 2 tropas movidas do Brasil = 5 tropas
- **Chile**: 2 tropas (originais) + 2 tropas movidas do Uruguai = 4 tropas

#### Por que só 2 tropas?
- Do Uruguai só podem sair as tropas **originais** (3 - 1 = 2)
- As tropas movidas do Brasil para o Uruguai **não podem ser movidas novamente no mesmo turno**
- Regra: sempre deve permanecer 1 tropa fixa

### 🔄 **TURNO 2 - Jogador Vermelho**

#### **RESET COMPLETO**: Todas as tropas voltam a ser "movíveis"!
- **Brasil**: 1 tropa (fixa) + 4 tropas que podem ser movidas novamente
- **Uruguai**: 3 tropas (originais) + 4 tropas que podem ser movidas novamente
- **Chile**: 2 tropas (originais) + 2 tropas que podem ser movidas novamente

#### Agora é possível mover tropas que foram movidas no turno anterior!

## 🏗️ Estrutura de Dados

```javascript
tropasMovidas: {
  jogador: {
    territorio: {
      tropasOriginais: X,        // Tropas que o território tinha no início
      tropasMovidas: Y,          // Total de tropas movidas deste território
      tropasIndividuais: [       // Array de cada tropa movida
        {
          id: "territorio_timestamp_index",
          origem: "territorio_origem",
          destino: "territorio_destino",
          turno: "jogador"
        }
      ]
    }
  }
}
```

## ✅ Validações Implementadas

### Na Função `verificarMovimentoRemanejamento`:
1. Verifica se o território de origem tem tropas disponíveis para movimento
2. **CORRIGIDO**: Não considera mais o território de destino como limitação
3. Calcula a quantidade máxima baseada apenas no território de origem

### Na Função `moverTropas`:
1. Aplica as mesmas validações corrigidas
2. Rastreia cada tropa individualmente
3. Atualiza o contador de tropas movidas em ambos os territórios

## 🎯 Benefícios do Sistema

1. **Estratégia Realista**: Força os jogadores a pensarem estrategicamente sobre onde colocar suas tropas
2. **Prevenção de Exploits**: Evita movimentação infinita de tropas **durante o mesmo turno**
3. **Flexibilidade Entre Turnos**: Permite reorganização estratégica a cada novo turno
4. **Rastreamento Completo**: Cada tropa é rastreada individualmente **por turno**
5. **Regras Claras**: Sistema previsível e fácil de entender
6. **Dinâmica de Jogo**: Cria oportunidades estratégicas a cada turno

## 🔧 Como Testar

1. Inicie uma partida e entre na fase de remanejamento
2. Tente mover tropas entre territórios
3. Observe que as tropas movidas não podem ser movidas novamente **no mesmo turno**
4. Verifique que sempre deve permanecer 1 tropa fixa em cada território
5. **Aguarde o próximo turno** e observe que todas as tropas voltam a ser movíveis
6. **Teste o reset**: Mova tropas no turno 1, passe o turno, e mova-as novamente no turno 2

## 🔄 Reset Entre Turnos

### **O que acontece a cada novo turno:**
- ✅ **Todas as tropas movidas voltam a ser "movíveis"**
- ✅ **O rastreamento é completamente resetado**
- ✅ **Novas oportunidades estratégicas surgem**
- ✅ **Sistema de "memória" é limpo**

### **Código que implementa o reset:**
```javascript
// Linha 1019 e 1151 do server.js
if (playerRoom.tropasMovidas[playerRoom.turno]) {
  delete playerRoom.tropasMovidas[playerRoom.turno];
}
```

## 📝 Notas Técnicas

- O sistema mantém compatibilidade com o código existente
- As validações são feitas tanto no cliente quanto no servidor
- **O rastreamento é resetado a cada novo turno** (linhas 1019 e 1151 do server.js)
- **Reset automático**: `delete playerRoom.tropasMovidas[playerRoom.turno]`
- **Todas as tropas voltam a ser "movíveis" a cada turno**
- Mensagens de erro claras são exibidas quando as regras são violadas
- Sistema de rastreamento por jogador e por turno

## 🐛 **BUGS CORRIGIDOS - Sistema Agora Funcionando Perfeitamente!**

### **Bug 1: Validação de Território de Destino (CORRIGIDO)**
- O sistema estava limitando o movimento baseado no território de destino
- Isso causava comportamentos estranhos como:
  - Território com 2 tropas não conseguia mover 1 tropa
  - Território com 6 tropas (4+2) não conseguia mover 3 tropas para destino com 1 tropa

**Solução:** Apenas o território de origem limita o movimento

### **Bug 2: Cálculo Incorreto de Tropas Disponíveis (CORRIGIDO)**
- O sistema estava usando `territorioOrigem.tropas` (tropas atuais) em vez de `tropasOriginais`
- Isso causava o problema: território com 3 tropas → move 1 → não conseguia mover mais nada

**Exemplo do bug:**
- Território começa com 3 tropas
- Move 1 tropa → fica com 2 tropas
- Sistema calculava: `2 - 1 - 1 = 0` (2 tropas atuais - 1 já movida - 1 fixa = 0)
- **Resultado:** Não podia mover mais nada ❌

**Solução implementada:**
- Agora usa `tropasOriginais - tropasJaMovidas - 1`
- Cálculo correto: `3 - 1 - 1 = 1` (3 tropas originais - 1 já movida - 1 fixa = 1)
- **Resultado:** Pode mover 1 tropa novamente ✅

### **Validação Final Corrigida:**
```javascript
// ANTES (incorreto):
const tropasDisponiveis = territorioOrigem.tropas - tropasJaMovidas - 1;

// DEPOIS (correto):
const tropasDisponiveis = playerRoom.tropasMovidas[playerRoom.turno][dados.origem].tropasOriginais - tropasJaMovidas - 1;
```
