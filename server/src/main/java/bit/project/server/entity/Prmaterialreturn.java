package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Prmaterialreturn{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    @Lob
    private String reason;

    private LocalDateTime tocreation;


    @ManyToOne
    private Prorder prorder;

    @OneToMany(mappedBy="prmaterialreturn", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Prmaterialreturnmaterial> prmaterialreturnmaterialList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Prmaterialreturn(Integer id){
        this.id = id;
    }

    public Prmaterialreturn(Integer id, String code, Prorder prorder, LocalDate date){
        this.id = id;
        this.code = code;
        this.prorder = prorder;
        this.date = date;
    }

}