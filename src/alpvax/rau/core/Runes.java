package alpvax.rau.core;

import java.security.InvalidParameterException;
import java.util.HashMap;
import java.util.Map;

import alpvax.common.util.generics.StringMap;

public class Runes
{
	//***********************PROCESSING***********************
	public static FontType CURRENT_ENCODING = FontType.UNICODE;
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
		Integer i = Integer.valueOf(rune.index + rune.section.getStart(CURRENT_ENCODING));
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
			add(new Rune(rune.index + 1, rune.section, rune.name).setPillared(PillaredState.PILLARED));
		}
		return rune;
	}

	public static class Rune implements Comparable<Rune>
	{
		public final int index;
		public final String name;
		public String uniqueName;
		private PillaredState pillared = PillaredState.NONE;
		private RuneSection section;
		
		public Rune(int index, RuneSection type, String name)
		{
			if(index < 0 || index >= 6400)
			{
				throw new InvalidParameterException("\"index\" must be between 0 and 6399 (inclusive). Recieved: " + index);
			}
			this.index = index;
			this.name = name;
			uniqueName = name;
			section = type;
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
			return section;
		}
		
		@Override
		public String toString()
		{
			return Character.toString(toChar());
		}
		
		public char toChar()
		{
			return (char)(section.getStart(CURRENT_ENCODING) + index);
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

		@Override
		public int compareTo(Rune other)
		{
			int i = section.ordinal() - other.section.ordinal();
			return i == 0 ? index - other.index : i;
		}
	}
	
	private enum PillaredState
	{
		NONE, NORMAL, PILLARED;
	}
	
	private enum FontType
	{
		ASCII, UNICODE;
	}
		
	public enum RuneSection
	{
		LETTERS(0, 0xE000),
		NUMBERS(80, 0xE050),
		PUNCTUATION(96, 0xE060),
		FORMATTING(120, 0xE100),
		OTHER(128, 0xE200);
		/**
		 * Use this as opposed to the values() method to prevent the array being cloned each time.
		 * DO NOT MODIFY!
		 */
		public static final RuneSection[] values = values();
		
		private int[] start;
		private RuneSection(int... starts)
		{
			if(starts == null || starts.length < 1)
			{
				throw new InvalidParameterException("Must have a start point for each supported Font type");
			}
			start = new int[starts.length];
			for(int i = 0; i < starts.length; i++)
			{
				start[i] = starts[i];
			}
		}

		/*public int getStart()
		{
			return getStart(0);
		}*/
		public int getStart(FontType fontType)
		{
			return getStart(fontType.ordinal());
		}
		public int getStart(int fontType)
		{
			return fontType < 1 || fontType >= start.length ? start[0] : start [fontType];
		}
	}
	

	//***********************RUNE LIST***********************
	public static final Rune EE = add(new Rune(0, RuneSection.LETTERS, "ee").setPillaredAllowed());
	public static final Rune HARR = add(new Rune(2, RuneSection.LETTERS, "harr").setPillaredAllowed());
	public static final Rune KORR = add(new Rune(4, RuneSection.LETTERS, "korr").setPillaredAllowed());
	public static final Rune MEH = add(new Rune(6, RuneSection.LETTERS, "meh").setPillaredAllowed());
	public static final Rune SJUH = add(new Rune(8, RuneSection.LETTERS, "sjuh").setPillaredAllowed());
	public static final Rune JA = add(new Rune(10, RuneSection.LETTERS, "ja").setPillaredAllowed());
	public static final Rune CHAIR = add(new Rune(12, RuneSection.LETTERS, "chair").setPillaredAllowed());
	public static final Rune ORR = add(new Rune(14, RuneSection.LETTERS, "orr").setPillaredAllowed());
	public static final Rune LEUGH = add(new Rune(16, RuneSection.LETTERS, "leugh").setPillaredAllowed());
	public static final Rune VARR = add(new Rune(18, RuneSection.LETTERS, "varr").setPillaredAllowed());
	public static final Rune THORR = add(new Rune(20, RuneSection.LETTERS, "thorr").setPillaredAllowed());
	public static final Rune NA = add(new Rune(22, RuneSection.LETTERS, "na").setPillaredAllowed());
	public static final Rune BAIR = add(new Rune(24, RuneSection.LETTERS, "bair").setPillaredAllowed());
	public static final Rune DUH = add(new Rune(26, RuneSection.LETTERS, "duh").setPillaredAllowed());
	public static final Rune ARR = add(new Rune(28, RuneSection.LETTERS, "arr").setPillaredAllowed());
	public static final Rune SO = add(new Rune(30, RuneSection.LETTERS, "so").setPillaredAllowed());
	public static final Rune TORR = add(new Rune(32, RuneSection.LETTERS, "torr").setPillaredAllowed());
	public static final Rune PAIR = add(new Rune(34, RuneSection.LETTERS, "pair").setPillaredAllowed());
	public static final Rune EUGH = add(new Rune(36, RuneSection.LETTERS, "eugh").setPillaredAllowed());
	public static final Rune GO = add(new Rune(38, RuneSection.LETTERS, "go").setPillaredAllowed());
	public static final Rune CKHORR = add(new Rune(40, RuneSection.LETTERS, "ckhorr").setPillaredAllowed());
	public static final Rune DJARR = add(new Rune(42, RuneSection.LETTERS, "djarr").setPillaredAllowed());
	public static final Rune ROO = add(new Rune(44, RuneSection.LETTERS, "roo").setPillaredAllowed());
	public static final Rune AIR = add(new Rune(46, RuneSection.LETTERS, "air").setPillaredAllowed());
	public static final Rune FEE = add(new Rune(48, RuneSection.LETTERS, "fee").setPillaredAllowed());
	public static final Rune EYE = add(new Rune(50, RuneSection.LETTERS, "eye"));
	public static final Rune OO = add(new Rune(51, RuneSection.LETTERS, "oo"));
	
	public static final Rune ATZ = add(new Rune(0, RuneSection.NUMBERS, "atz"));
	public static final Rune OHS = add(new Rune(1, RuneSection.NUMBERS, "ohs"));
	public static final Rune SJEM = add(new Rune(2, RuneSection.NUMBERS, "sjem"));
	public static final Rune OHNOH = add(new Rune(3, RuneSection.NUMBERS, "ohnoh"));
	public static final Rune NEVE = add(new Rune(4, RuneSection.NUMBERS, "neve"));
	public static final Rune FEEOH = add(new Rune(5, RuneSection.NUMBERS, "fee-oh"));
	public static final Rune TUVOH = add(new Rune(6, RuneSection.NUMBERS, "tuvoh"));
	public static final Rune ESTE = add(new Rune(7, RuneSection.NUMBERS, "este"));
	public static final Rune ELMA = add(new Rune(8, RuneSection.NUMBERS, "elma"));
	public static final Rune ALNU = add(new Rune(9, RuneSection.NUMBERS, "alnu"));
	
	public static final Rune RAU = add(new Rune(0, RuneSection.PUNCTUATION, "rau"));
	public static final Rune RAN = add(new Rune(1, RuneSection.PUNCTUATION, "ran"));
	public static final Rune RULL = add(new Rune(2, RuneSection.PUNCTUATION, "rull"));
	public static final Rune ROCHK = add(new Rune(3, RuneSection.PUNCTUATION, "rochk"));
	public static final Rune VEE = add(new Rune(4, RuneSection.PUNCTUATION, "vee"));
	public static final Rune DEN = add(new Rune(5, RuneSection.PUNCTUATION, "den"));
}
