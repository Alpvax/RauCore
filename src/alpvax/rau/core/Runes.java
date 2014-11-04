package alpvax.rau.core;

import java.security.InvalidParameterException;
import java.util.HashMap;
import java.util.Map;

import alpvax.common.util.generics.StringMap;

public class Runes
{
	//***********************RUNE LIST***********************
	public static final Rune EE = add(new Rune(0, "ee").setPillaredAllowed());
	public static final Rune HARR = add(new Rune(2, "harr").setPillaredAllowed());
	public static final Rune KORR = add(new Rune(4, "korr").setPillaredAllowed());
	public static final Rune MEH = add(new Rune(6, "meh").setPillaredAllowed());
	public static final Rune SJUH = add(new Rune(8, "sjuh").setPillaredAllowed());
	public static final Rune JA = add(new Rune(10, "ja").setPillaredAllowed());
	public static final Rune CHAIR = add(new Rune(12, "chair").setPillaredAllowed());
	public static final Rune ORR = add(new Rune(14, "orr").setPillaredAllowed());
	public static final Rune LEUGH = add(new Rune(16, "leugh").setPillaredAllowed());
	public static final Rune VARR = add(new Rune(18, "varr").setPillaredAllowed());
	public static final Rune THORR = add(new Rune(20, "thorr").setPillaredAllowed());
	public static final Rune NA = add(new Rune(22, "na").setPillaredAllowed());
	public static final Rune BAIR = add(new Rune(24, "bair").setPillaredAllowed());
	public static final Rune DUH = add(new Rune(26, "duh").setPillaredAllowed());
	public static final Rune ARGH = add(new Rune(28, "argh").setPillaredAllowed());
	public static final Rune SO = add(new Rune(30, "so").setPillaredAllowed());
	public static final Rune TORR = add(new Rune(32, "torr").setPillaredAllowed());
	public static final Rune PAIR = add(new Rune(34, "pair").setPillaredAllowed());
	public static final Rune EURGH = add(new Rune(36, "eurgh").setPillaredAllowed());
	public static final Rune GO = add(new Rune(38, "go").setPillaredAllowed());
	public static final Rune CKHORR = add(new Rune(40, "ckhorr").setPillaredAllowed());
	public static final Rune DJARR = add(new Rune(42, "djarr").setPillaredAllowed());
	public static final Rune ROO = add(new Rune(44, "roo").setPillaredAllowed());
	public static final Rune AIR = add(new Rune(46, "air").setPillaredAllowed());
	public static final Rune FEE = add(new Rune(48, "fee").setPillaredAllowed());
	public static final Rune EYE = add(new Rune(50, "eye"));
	public static final Rune OO = add(new Rune(51, "oo"));
	
	public static final Rune ATZ = add(new Rune(80, "atz"));
	public static final Rune OHS = add(new Rune(81, "ohs"));
	public static final Rune SJEM = add(new Rune(82, "sjem"));
	public static final Rune OHNOH = add(new Rune(83, "ohnoh"));
	public static final Rune NEVE = add(new Rune(84, "neve"));
	public static final Rune FEEOH = add(new Rune(85, "fee-oh"));
	public static final Rune TUVOH = add(new Rune(86, "tuvoh"));
	public static final Rune ESTE = add(new Rune(87, "este"));
	public static final Rune ELMA = add(new Rune(88, "elma"));
	public static final Rune ALNU = add(new Rune(89, "alnu"));
	
	public static final Rune RAU = add(new Rune(256, "rau"));
	public static final Rune RAN = add(new Rune(257, "ran"));
	public static final Rune RULL = add(new Rune(258, "rull"));
	public static final Rune ROCHK = add(new Rune(259, "rochk"));
	public static final Rune VEE = add(new Rune(260, "vee"));
	public static final Rune DEN = add(new Rune(261, "den"));
	

	//***********************PROCESSING***********************
	public static final int FIRST_INDEX = 0xE000;
	private static final String PILLARED_NAME = "pillared_%s";
	
	/** Map of Runes retrievable by index */
	public static Map<Integer, Rune> runeList;
	/** Map of Runes retrievable by Object.toString() returning same as Rune.toString()*/
	public static StringMap<Rune> runeMap;
	/** Map of Runes retrievable by unique_name */
	public static Map<String, Rune> runeNames;
	/** Map of Runes retrievable by name. Will always return the unPillared version*/
	public static Map<String, Rune> runeNamesBase;
	
	private static Rune add(Rune rune)
	{
		if(runeList == null)
		{
			runeList = new HashMap<Integer, Rune>();
			runeMap = new StringMap<Rune>();
			runeNames = new HashMap<String, Rune>();
			runeNamesBase = new HashMap<String, Rune>();
		}
		Integer i = Integer.valueOf(rune.index);
		if(runeList.containsKey(i))
		{
			throw new InvalidParameterException(String.format("Unable to register Rune \"%1$s\". Rune \"%2$s\" already registered with index %3$d.", rune.name, runeList.get(i).name, i));
		}
		runeList.put(i, rune);
		runeMap.put(rune.toString(), rune);
		runeNames.put(rune.uniqueName, rune);
		if(!runeNamesBase.containsKey(rune.name))
		{
			runeNamesBase.put(rune.name, rune);
		}
		if(rune.pillared == PillaredState.NORMAL)
		{
			add(new Rune(rune.index + 1, rune.name).setPillared(PillaredState.PILLARED));
		}
		return rune;
	}

	public static class Rune
	{
		public final int index;
		public final String name;
		public String uniqueName;
		private PillaredState pillared = PillaredState.NONE;
		
		public Rune(int index, String name)
		{
			if(index < 0 || index >= 6400)
			{
				throw new InvalidParameterException("\"index\" must be between 0 and 6399 (inclusive). Recieved: " + index);
			}
			this.index = index;
			this.name = name;
			uniqueName = name;
		}
		
		public Rune setPillaredAllowed()
		{
			return setPillared(PillaredState.NORMAL);
		}
		private Rune setPillared(PillaredState state)
		{
			pillared = state;
			uniqueName = state == PillaredState.PILLARED ? String.format(PILLARED_NAME, name) : name;
			return this;
		}
		public Rune getPillared()
		{
			return runeNames.get(String.format(PILLARED_NAME, name));
		}
		public Rune getOtherState()
		{
			return allowPillared() ? isPillared() ? getPillared(): runeNamesBase.get(name) : null;
		}
		
		public boolean allowPillared()
		{
			return pillared != PillaredState.NONE;
		}
		public boolean isPillared()
		{
			return pillared == PillaredState.PILLARED;
		}
		
		public RuneSection getSection()
		{
			return RuneSection.get(index);
		}
		
		@Override
		public String toString()
		{
			return Character.toString(toChar());
		}
		
		public char toChar()
		{
			return (char)(FIRST_INDEX + index);
		}
		
		@Override
		public boolean equals(Object other)
		{
			return other != null ? other.toString().equals(toString()) : false;
		}
		
		public boolean equalsIgnoreCase(Rune other)
		{
			return other != null ? name.equals(other.name) : false;
			//return other != null ? equals(runeList.get(Integer.valueOf(other.index + pillared.ordinal() - other.pillared.ordinal()))) : false;
		}
		
		@Override
		public int hashCode()
		{
			return toString().hashCode();
		}
	}
	
	private enum PillaredState
	{
		NONE, NORMAL, PILLARED;
	}
		
	public enum RuneSection
	{
		LETTERS(0),
		NUMBERS(50),
		PUNCTUATION(60),
		GRAMMAR(100),
		OTHER(200);
		/**
		 * Use this as opposed to the values() method to prevent the array being cloned each time.
		 * DO NOT MODIFY!
		 */
		public static final RuneSection[] values = values();
		
		private int start;
		private RuneSection(int hexStart)
		{
			start = Integer.parseInt(String.format("E%03d", hexStart), 16);
		}
		
		public static RuneSection get(int index)
		{
			RuneSection s = LETTERS;
			for(RuneSection r : values)
			{
				if(index < r.start)
				{
					return s;
				}
				s = r;
			}
			return OTHER;
		}
	}
}
